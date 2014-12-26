/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint forin:true, noarg:false, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, curly:false, browser:true,
  unused:true,
  indent:2, maxerr:50, devel:true, node:true, boss:true, white:true,
  globalstrict:true, nomen:false, newcap:true, esnext: true, moz: true  */

/*global require, console */

/**!
  About this module:

  Runner
  repair list // Should move?
  Main loop

  This is is the output target for webpack
*/


/**
  potential problems:
  - state actually isn't constant over run.  should we fix that. TODO.
  -

  Should be doing something smart to check lots of deps in one go?
  Maybe wait until addons list to get smarter about this?
  Or only run a subset of these recipes for each person each day?

  Do all recipe names need to be unique?  If so, why don't I define an obj instead of a list.


TODO?  Promises or callback as first arg?  Are we node?

*/


"use strict";

console.log(
  "Welcome to heart heart heart beat."
);

let actions = require("actions");

// should this be gotten every time?  This is async, right?
let state;

// should this promise?  GRL likes promises
let getState = function (cb) {
  // set by side effect, yuck
  let herestate = state = {addons: [], os: 'yep', homepage: "jerryjerryjerry.net"};  // set by side effect?  really?
  cb(state);
};


// TODO, write this, decide of return val (throw? false?  list of errors?)
// TODO, use an existing validation system?
let validateConfig = function (config) {
  return (
    (config.name !== undefined) &&
    (config.recipe !== undefined) &&
    (config.shouldRun !== undefined)
  );
  // has keys
  // these are callables
  //
}; //

let attemptRun = function (recipe, state) {
  if (! validateConfig(recipe))  throw "invalid config";
  if (recipe.shouldRun(state)) {
    actions.log("will run", recipe);
    recipe.recipe(state, function(){});  // yeah, not sure what all the effects here should be
  } else {
    actions.log("will not run");
  }
};

// should this call back with some sort of progress / success obj?
// like which ran, and their statuses?
let runAll = function (repairs, state, cb) {
  let l = repairs.length;
  actions.log(l);
  for (let ii=0; ii < l; ii++) {
    // note state gets changed by repairs, by definition
    let repair = repairs[ii];
    actions.log("attempting", repair.name);
    attemptRun(repair, state);
  }
  cb(true);
};


// is there a timer here? I dunno!
let mainloop = function (repairsList) {
  getState(
   function (state) {
      actions.log("about to runAll");
      runAll(repairsList, state,
      function () { actions.log("runAll callback"); }
     );}
  );
};


// actually run
mainloop(require("./repairs"));

// loop over the list?
// do them all?
// sync or async?
// ye gods it is Test Pilot *AND* telemetry experiment all over again.
// is this reinventing the darn wheel?
