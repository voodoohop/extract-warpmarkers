
import fs from "fs";
import { last }  from "lodash-es";
import { parseFile } from 'music-metadata';


var post = () => null; //console.log.bind(console);


function getMarkersArrayFromBuffer({ buffer, filename, duration }) {

  var markersArr = [];


  var offset = 0;
  var index = 0;
  while ((index = buffer.indexOf("WarpMarker", index)) >= 0) {
    if (index >= 0) {
      offset += index;
      index = index + "WarpMarker".length + 4;
      post("pos", index);
      var pos = [buffer.readDoubleLE(index), buffer.readDoubleLE(index + 8)];

      post("found warp marker at", index + " " + pos[0] + "," + pos[1] + "," + "\n");
      if (pos[0] < duration)
        markersArr.push({
          beats: pos[1],
          ms: pos[0] * 1000
        })
      else
        console.error("bad marker position (larger than duration encountered)", pos[0], pos[1], filename);
    }
  }

  if (markersArr.length > 2)
    markersArr.shift(); // throw annoying marker away

  return markersArr;
}

function extractFromBuffer({
  buffer,
  filename,
  duration,
  samprate,
  resolve
}) {



  var markersArr = getMarkersArrayFromBuffer({ buffer, filename, duration });

  //console.log("markersAfter", JSON.stringify(markersArr));

  const noMarkersFound = markersArr.length == 0;

  if (noMarkersFound) {
    console.error("No markers found. Press save! next to the live clip.")
  }
  var fm = markersArr[0];
  //var tm = markersArr[2];
  var lm = markersArr[markersArr.length - 1];
  var lastToFirstSpeed = (lm.beats - fm.beats) / (lm.ms - fm.ms);
  // var extrapolateLastBeats = (duration - fm.ms) * lastToFirstSpeed + fm.beats;
  var refBpm = lastToFirstSpeed * 60000; //((extrapolateLastBeats ) / (duration )) * 60000;
  var newMarkers = [];
  //refBpm=100.0;
  // post("REFBPM", {refBpm, lm, fm, duration, filename});
  for (var i = 0; i < markersArr.length - 1; i++) {
    var bpmNow = (markersArr[i + 1].beats - markersArr[i].beats) / (markersArr[i + 1].ms - markersArr[i].ms) * 1000 * 60;
    var info = {
      sourcetime: markersArr[i].ms,
      bpm: bpmNow,
      beats: markersArr[i].beats
    }
    newMarkers.push(info);
    //Postln("info1", info);
  }
  var firstm = newMarkers[0];
  if (firstm.sourcetime > 0) {
    //console.log("FirstMarker", JSON.stringify(firstm), "\n");

    var firstSpeed = firstm.bpm / 60000;
    var info2 = {
      sourcetime: 0, //firstm.sourcetime - firstm.beats / firstSpeed,
      bpm: firstm.bpm,
      beats: firstm.beats - (firstm.sourcetime * firstSpeed)
    };


    newMarkers.unshift(info2);
  }

  newMarkers[0].desttime = newMarkers[0].beats / refBpm * 60 * 1000;
  // console.log("first two markers");
  // console.table(newMarkers);

  var lm2 = newMarkers[newMarkers.length - 1];
  // lm
  var lastBpm = newMarkers[newMarkers.length - 1].bpm;
  if (lm2.sourcetime < duration) newMarkers.push({
    sourcetime: duration,
    bpm: lastBpm,
    beats: lm2.beats + (duration - lm2.sourcetime) * lastBpm / 60000
  });

  for (var i = 1; i < newMarkers.length; i++) {
    var relSpeed = newMarkers[i - 1].bpm / refBpm;
    newMarkers[i].desttime = newMarkers[i - 1].desttime + (newMarkers[i].sourcetime - newMarkers[i - 1].sourcetime) * relSpeed;
    //Postln("calculated desttime",i,newMarkers[i].desttime);
  }
  // console.log("second two markers");
  //           console.table(newMarkers);
  //outlet(2, refBpm);
  var lastSourceTime = -999999999;
  var lastDestTime = -999999999;
  var destTimes = [];
  var sourceTimes = [];
  var beatss = -1;
  //for (var i = 0; i < newMarkers.length; i++) {
  var warpMarkers = newMarkers.map(marker => {
    if (marker.desttime < lastDestTime || marker.sourcetime < lastSourceTime)
      return null;
    lastDestTime = Math.max(lastDestTime, marker.desttime);
    lastSourceTime = Math.max(lastSourceTime, marker.sourcetime);

    beatss = marker.desttime * refBpm / 60000;

    var markerObj = {
      "desttime": marker.desttime,
      "sourcetime": marker.sourcetime,
      "beats": beatss,
      "playSpeed": refBpm / marker.bpm,
      "sourceBpm": marker.bpm,
      "desttimesample": Math.floor(marker.desttime * samprate / 1000),
      "sourcetimesample": Math.floor(marker.sourcetime * samprate / 1000),
      "samplesPerBeat": 1 / (marker.bpm / 60) * samprate
    };

    sourceTimes.push(marker.sourcetime / duration);
    destTimes.push(marker.desttime / duration);
    return markerObj;
  }).filter(w => w !== null);
  //console.log("time (marker extract):", new Date().getTime() - startTime);
  // outlet(1, warpMarkers.size);
  // Postln("sending dictionary content:",JSON.stringify(dict_to_jsobj(markers)));
  // console.log("final warp markers", warpMarkers);
  // console.table(warpMarkers);
  const fileStat = fs.existsSync(filename) ? fs.statSync(filename) : { mtime: 0 };
  var res = {
    error: null,
    path: filename,
    pathStat: JSON.parse(JSON.stringify(fileStat)),
    warpMarkers: warpMarkers,
    baseBpm: refBpm,
    durationBeats: last(warpMarkers).beats - warpMarkers[0].beats,
    markersSaved: !noMarkersFound
  };
  //clipDict.replace("metaData",audioMetaData);
  //outlet(0, "dictionary", audioMetaData.name);
  // f.close();
  // post("resolving",filename);
  // if (resolve) 
  // console.timeEnd(`extractWarpMarkers_${filename}`);
  resolve(res);
}

export default function extractWarpMarkers(path, duration, samprate) {

  return new Promise((resolveMe, reject) => {

    // post("possst extracting warp markers", path, audioMetaData.toString(), "\n");


    var filename = path + ".asd";
    // post(filename + "\n");
    //length--; // to stop from reading after sample end
    // console.time(`extractWarpMarkers_${filename}`);
    // var f = new File(filename);
    fs.readFile(filename, (err, buffer) => extractFromBuffer({
      buffer,
      filename,
      duration,
      samprate,
      resolve: resolveMe
    }));
    // });
  })
};





const analyseAudio = async path => {
  const { format } = await parseFile(path);
  const { sampleRate, duration } = format;
  console.log((await extractWarpMarkers(path, duration, sampleRate)).warpMarkers);
};

// console.log(process.argv)
analyseAudio(process.argv[2]);