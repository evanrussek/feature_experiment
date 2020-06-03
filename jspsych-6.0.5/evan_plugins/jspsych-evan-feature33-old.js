
jsPsych.plugins["evan-feature33"] = (function() {

  var plugin = {};

  plugin.info = {
    name: "evan-feature33",
    parameters: {
        c1_reward_prob: { // probability of outcome 1 if choice is 1
          type: jsPsych.plugins.parameterType.FLOAT,
          default: undefined
        },
        c2_reward_prob: { // probability of outcome 1 if cohice is 2
          type: jsPsych.plugins.parameterType.FLOAT,
          default: undefined
        },
        c1_image: { // image to represent choice 1
          type: jsPsych.plugins.parameterType.IMAGE,
          default: undefined
        },
        c2_image: { // image to represent choice 2
          type: jsPsych.plugins.parameterType.IMAGE,
          default: undefined
      },
      choice_prompt: { // show a prompt?
        type: jsPsych.plugins.parameterType.BOOL,
        default: true
      }
    }
 }

  plugin.trial = function(display_element, trial) {

    // keys for left and right
    var choose_left_key = '1';
    var choose_right_key = '2';

    // screen width and height
    var parentDiv = document.body;
    var w = parentDiv.clientWidth;
    var h = parentDiv.clientHeight;


    // fixation parameters
    var fixation_font_size = h/10;
    var fixation_x = w/2;
    var fixation_y = h/2;
    var fixation_color = "white";

    // place things that are constant throughout the trial

    // place the svg -- this is like a canvas on which we'll draw things
    //  use d3 to chain together commands  -
    //  this adds lines to the html file which can be viewed in the browser
    d3.select(".jspsych-content-wrapper")     //  select the part of html in which to place it (the .jspsych-content-wrapper)
                .append("svg") // append an svg element
                .attr("width", w) // specify width and height
                .attr("height", h)

    // place a grey background rectangle over the whole svg
    // place grey background on it
    d3.select("svg").append("rect")
          .attr("x", 0).attr("y", 0).attr("width", w)
          .attr("height", h).style("fill", 'gray').style("opacity",.7);

    // function to place the choice stims and wait for a response (called at the bottom of plugin.trial)

    var display_choice_stim_wait_for_response = function(){

      var choice_img_width = w/10;
      var choice_img_height = w/10;

      // place left image background
      //d3.select("svg").append("rect")
      //        .attr("class","choice cL") // this will let us reference the object to change it's color
      //        .attr("x", w/3 - choice_bkg_width/2)
      //        .attr("y", h/2 - choice_bkg_height/2)
      //        .attr("width", choice_bkg_width)
      //        .attr("height", choice_bkg_height)
      //        .style("fill", "blue")
      //        .style("opacity",1); // set the

        // place right image background
      //  d3.select("svg").append("rect")
      //        .attr("class","choice cR") // this will let us reference the object to change it's color
      //        .attr("x", 2*w/3 - choice_bkg_width/2)
      //        .attr("y", h/2 - choice_bkg_height/2)
      //        .attr("width", choice_bkg_width)
      //        .attr("height", choice_bkg_height)
      //        .style("fill", "blue")
      //        .style("opacity",1); // set the


        // place choice left image - note how we reference trial.c1_image - this was passed in
        d3.select("svg").append("svg:image").attr("class", "choice cL").attr("x", w/3 - choice_img_width/2)
            .attr("y", h/2 - choice_img_height/2).attr("width",choice_img_width).attr("height",choice_img_height)
            .attr("xlink:href", trial.c1_image).style("opacity",1);

        // place choice left image - note how we reference trial.c1_image - this was passed in
        d3.select("svg").append("svg:image").attr("class", "choice cR").attr("x", 2*w/3 - choice_img_width/2)
            .attr("y", h/2 - choice_img_height/2).attr("width",choice_img_width).attr("height",choice_img_height)
            .attr("xlink:href", trial.c2_image).style("opacity",1);

        if (trial.choice_prompt){
          d3.select("svg").append("text")
                        .attr("class", "choice text")
                        .attr("x", w/2)
                        .attr("y", 7*h/8)
                        .attr("font-family","monospace")
                        .attr("font-weight","bold")
                        .attr("font-size",h/40)
                        .attr("text-anchor","middle")
                        .attr("fill", "white")
                        .style("opacity",1)
                        .text('Press 1 for LEFT machine or 2 for RIGHT machine')
        }


        // define response handler function // function is automatically called
        // at response and info has response information
        var handle_response = function(info){

          // clear timeout counting response time // more relevant for if
          // a timer was set to limit the response time.
          jsPsych.pluginAPI.clearAllTimeouts();
          // kill keyboard listeners
          if (typeof keyboardListener !== 'undefined') {
            jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
          }

          // info is automatically passed into this and has response information
          if (response.key == null) {
              response = info;
          }

          // convert the choice key to a character
          var choice_char = jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(response.key);

          // this references the class name we used when we placed the choice images -
          // CL is the left stimulus and CR is the right stimulus
          // we'll use this to change the color of what they chose, and fade out what they ddn't choose
          if (choice_char == choose_left_key){
            var chosen_class = '.cL';
            var unchosen_class = '.cR';
            // response is a global variable (no var in front of it)
            // this lets us reference it in the next function
            response.chosen_side = 1;
          }
          else if (choice_char == choose_right_key){
            var chosen_class = '.cR';
            var unchosen_class = '.cL';
            response.chosen_side = 2;}
          else{console.log('SURPRISE');}

          // select what they choise and change it to red (note this only affects the rect, not the image because that doesn't have a color attribute)
          d3.select(chosen_class).style('fill',"red");
          // transition the opacty of what they didn't chcoose to 0 (over 350 milliseconds)
          d3.selectAll(unchosen_class).transition().style('opacity',0).duration(350)


          // wait for some amount of time and then call display outcome
          jsPsych.pluginAPI.setTimeout(function() {
              // remove the choice class
              d3.selectAll(".choice").remove()
              display_outcome();

            }, 800); // this runs 800 ms after choice is made

        } // end handle response function

        // define function to handle responses that are too slow
        var handle_slow_response = function(){
            jsPsych.pluginAPI.clearAllTimeouts();

            // place text 'please respond faster' in red
            d3.select("svg").append("text")
                      .attr("class", "outcome")
                      .attr("x", w/2)
                      .attr("y", h/2 + w/12)
                      .attr("font-family","monospace")
                      .attr("font-weight","bold")
                      .attr("font-size",w/24)
                      .attr("text-anchor","middle")
                      .attr("fill", "red")
                      .style("opacity",1)
                      .text('Please response faster')


          // record choice as 'slow'
          response.chosen_side = "SLOW";

          // wait some time and then end trial
          jsPsych.pluginAPI.setTimeout(function() {
              end_trial();
            }, 800); // show slow response for 800 milliseconds
          } // end handle slow response


        // define valid responses - these keys were defined above
        var valid_responses = [choose_left_key, choose_right_key];

        // jspsych function to listen for responses
        var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
            callback_function: handle_response, // call handle_response if valid response is entered
            valid_responses: valid_responses, // defines which keys to accept
            rt_method: 'performance', //
            persist: false,
            allow_held_key: false
          });

        // define max response tiem - set timer to wait for that time (this will be turned off when they make a response)
        var max_response_time = 3000;
        // wait some time and then end trial
        jsPsych.pluginAPI.setTimeout(function() {
            handle_slow_response();
          }, max_response_time); // show slow response for 800 milliseconds
      } // end display_choice_stim_wait for response

      // function to display choice outcome.
      var display_outcome = function(){

        var reward_probs = [trial.c1_reward_prob, trial.c2_reward_prob];
        // draw random sample to see whether rewarded
        if (reward_probs[response.chosen_side - 1] < Math.random()){
          var reward_val = 1;
        }else{
          var reward_val = 0;
        }
        reward = reward_val;

        // wait for some amount of time and display reward
        jsPsych.pluginAPI.setTimeout(function() {
          // display reward val
          d3.select("svg").append("text")
                    .attr("class", "outcome")
                    .attr("x", w/2)
                    .attr("y", h/2 + w/12)
                    .attr("font-family","monospace")
                    .attr("font-weight","bold")
                    .attr("font-size",w/6)
                    .attr("text-anchor","middle")
                    .attr("fill", "yellow")
                    .style("opacity",1)
                    .text(reward_val)

          }, 500); // this runs wait 500 then show reward


        // wait some time and then end trial
        jsPsych.pluginAPI.setTimeout(function() {
            // remove the choice class
            end_trial();

          }, 1500); // 1500 msec after display_outcome is called
      } // end display outcome

    /// functon to end trial, save data,
    var end_trial = function(){

      // kill the keyboard listener, if you haven't yet
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      // remove the canvas and everthing within it
      d3.select('svg').remove()

      // add correctness answer
      //console.log('correct: ' + correct_response)

      var trial_data = {
        "key_press_num": response.key,
        "chosen_side": response.chosen_side,
        "reward": reward,
        "rt": response.rt,
      };

      // record data, end trial
      jsPsych.finishTrial(trial_data);
    } // end end trial

    // define the response structure that we'll modify
    var response = {
        rt: null,
        key: null,
        key_press_num: null,
        chosen_side: null,
      };
      // needs to be predefined in case trial doesn't get response
      var reward = null;

    // wait pretrial time sec (this is the ITI), call first part of trial (this is the first thing called after initial display)
    jsPsych.pluginAPI.setTimeout(function() {
      display_choice_stim_wait_for_response();

    }, 1000); // this is where the ITI goes

  };

  return plugin;
})();
