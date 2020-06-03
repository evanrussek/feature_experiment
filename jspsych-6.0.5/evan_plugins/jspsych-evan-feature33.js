
jsPsych.plugins["evan-feature33"] = (function() {

  var plugin = {};

  plugin.info = {
    name: "evan-feature33",
    parameters: {
      c1_image: { // image to represent choice 1
          type: jsPsych.plugins.parameterType.IMAGE,
          default: undefined
        },
      c2_image: { // image to represent choice 2
          type: jsPsych.plugins.parameterType.IMAGE,
          default: undefined
      },
      c3_image: { // image to represent choice 3
        type: jsPsych.plugins.parameterType.IMAGE,
        default: undefined
      },
      c1_feature_probs: {
        type: jsPsych.plugins.parameterType.FLOAT,
        default: undefined
      },
      c2_feature_probs: {
        type: jsPsych.plugins.parameterType.FLOAT,
        default: undefined
      },
      c3_feature_probs: {
        type: jsPsych.plugins.parameterType.FLOAT,
        default: undefined
      },
      feature_rewards: {
        type: jsPsych.plugins.parameterType.FLOAT,
        default: undefined
      },
      choice_prompt: { // show a prompt?
        type: jsPsych.plugins.parameterType.BOOL,
        default: true
      }
    }
 }

  plugin.trial = function(display_element, trial) {

    var choice_idxs = [0,1,2];

    // this is the choice in each position
    var position_to_choice_idx = jsPsych.randomization.repeat(choice_idxs, 1);

    // keys for left and right
    var choose_left_key = 'j';
    var choose_middle_key = 'k';
    var choose_right_key = 'm';

    // figure out the outcomes for each feature
    var c1_f_outcomes = [];
    var c2_f_outcomes = [];
    var c3_f_outcomes = [];

    var c1_reward = 0;
    var c2_reward = 0;
    var c3_reward = 0;

    // determine outcomes and t
    for (f_idx = 0; f_idx < 3; f_idx++){
      // choice 1
      if (Math.random() < trial.c1_feature_probs[f_idx]){
        c1_f_outcomes.push(true);
        c1_reward = c1_reward + trial.feature_rewards[f_idx];
      }else{
        c1_f_outcomes.push(0)
      }

      // choice 2
      if (Math.random() < trial.c2_feature_probs[f_idx]){
        c2_f_outcomes.push(true);
        c2_reward = c2_reward + trial.feature_rewards[f_idx];
      }else{
        c2_f_outcomes.push(0)
      }

      // choice 3
      if (Math.random() < trial.c3_feature_probs[f_idx]){
        c3_f_outcomes.push(true);
        c3_reward = c3_reward + trial.feature_rewards[f_idx];
      }else{
        c3_f_outcomes.push(0)
      }
    }

    // combine these in a matrix...
    var c_f_outcomes = [c1_f_outcomes, c2_f_outcomes, c3_f_outcomes];
    var c_rewards = [c1_reward, c2_reward, c3_reward];

    // trial choice images: shuffle these later...
    var choice_images = [trial.c1_image, trial.c2_image, trial.c3_image];
    var feature_rewards = trial.feature_rewards;

    var feature_colors = ["blue", "silver", "gold"];

    // screen width and height
    var parentDiv = document.body;
    var w = parentDiv.clientWidth;
    var h = parentDiv.clientHeight;

    /// define constants for where images should appear...
    // width and height of the choice images
    var choice_img_width = w/10;
    var choice_img_height = w/10;

    var reward_info_y_arr = [h/4 - choice_img_height/3, h/4, h/4 + choice_img_height/3];
    var reward_info_x = w/2;

    // where on the screen to center these?
    var choice_image_y = h/2 - choice_img_height/2;
    var choice_image_x_arr = [w/4 - choice_img_width/2,
                              w/2 - choice_img_width/2,
                              3*w/4 - choice_img_width/2];

    var choice_y_stage2 = h/5 - choice_img_height/2;

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
          .attr("height", h).style("fill", 'black').style("opacity",.7);

    if (trial.choice_prompt){
      d3.select("svg").append("text")
                    .attr("class", "prompt")
                    .attr("x", w/2)
                    .attr("y", 9*h/10)
                    .attr("font-family","Helvetica")
                    .attr("font-weight","light")
                    .attr("font-size",h/40)
                    .attr("text-anchor","middle")
                    .attr("fill", "white")
                    .style("opacity",1)
                    .text('')
    }

    // function to place the choice stims and wait for a response (called at the bottom of plugin.trial)

    var display_choice_stim_wait_for_response = function(){

      // place reward info
      for (f_idx = 0; f_idx < 3; f_idx++){
        d3.select("svg").append("text")
                    .attr("class", "r_info")
                    .attr("x", reward_info_x)
                    .attr("y", reward_info_y_arr[f_idx])
                    .attr("font-family","Helvetica")
                    .attr("font-weight","light")
                    .attr("font-size",h/30)
                    .attr("text-anchor","middle")
                    .attr("fill", feature_colors[f_idx])
                    .style("opacity",1)
                    .text(feature_rewards[f_idx])
          //
        }

        // place choice left image - note how we reference trial.c1_image - this was passed in
        d3.select("svg").append("svg:image").attr("class", "choice cL").attr("x", choice_image_x_arr[0])
            .attr("y", choice_image_y).attr("width",choice_img_width).attr("height",choice_img_height)
            .attr("xlink:href", choice_images[position_to_choice_idx[0]]).style("opacity",1);

        // middle image
        d3.select("svg").append("svg:image").attr("class", "choice cM").attr("x", choice_image_x_arr[1])
            .attr("y", choice_image_y).attr("width",choice_img_width).attr("height",choice_img_height)
            .attr("xlink:href", choice_images[position_to_choice_idx[1]]).style("opacity",1);

        // place choice right image - note how we reference trial.c1_image - this was passed in
        d3.select("svg").append("svg:image").attr("class", "choice cR").attr("x", choice_image_x_arr[2])
            .attr("y", choice_image_y).attr("width",choice_img_width).attr("height",choice_img_height)
            .attr("xlink:href", choice_images[position_to_choice_idx[2]]).style("opacity",1);


        var choice_stage_text = choose_left_key.concat(": left, ", choose_middle_key, ": middle, ", choose_right_key, ": right");

        if (trial.choice_prompt){
          d3.select(".prompt").text(choice_stage_text)
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
            chosen_class = '.cL';
            unchosen_classes = '.cM,.cR';
            // response is a global variable (no var in front of it)
            // this lets us reference it in the next function
            response.chosen_pos = 0;
            unchosen_pos = [1, 2];
            chosen_state = position_to_choice_idx[0];
          }
          else if (choice_char == choose_middle_key){
            chosen_class = '.cM';
            unchosen_classes = '.cL,.cR';
            // response is a global variable (no var in front of it)
            // this lets us reference it in the next function
            response.chosen_pos = 1;
            unchosen_pos = [0, 2];
            chosen_state = position_to_choice_idx[1];
          }

          else if (choice_char == choose_right_key){
            chosen_class = '.cR';
            unchosen_classes = '.cL,.cM';
            response.chosen_pos = 2;
            unchosen_pos = [0,1];
            chosen_state = position_to_choice_idx[2];
          }
          else{console.log('SURPRISE');}

          // select multiple classes and phase them out
          // transition the opacty of what they didn't chcoose to 0 (over 350 milliseconds)
          d3.selectAll(unchosen_classes).transition().style('opacity',.25).duration(500)
          d3.selectAll('.r_info').transition().style('opacity',0).duration(500)

          // now move the chosen one up...



          // wait for some amount of time and then call display outcome
          jsPsych.pluginAPI.setTimeout(function() {
              display_chosen_state_features();

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
        var valid_responses = [choose_left_key, choose_middle_key, choose_right_key];

        // jspsych function to listen for responses
        var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
            callback_function: handle_response, // call handle_response if valid response is entered
            valid_responses: valid_responses, // defines which keys to accept
            rt_method: 'performance', //
            persist: false,
            allow_held_key: false
          });

        // define max response tiem - set timer to wait for that time (this will be turned off when they make a response)
        var max_response_time = 30000000000000000;
        // wait some time and then end trial
        jsPsych.pluginAPI.setTimeout(function() {
            handle_slow_response();
          }, max_response_time); // show slow response for 800 milliseconds
      } // end display_choice_stim_wait for response


      // should take in a position index?
      var display_chosen_state_features = function(){

        // move chosen state up and take 500 ms to do this...
        d3.select(chosen_class).transition().attr('y',choice_y_stage2).duration(500)

        jsPsych.pluginAPI.setTimeout(function() {
          // wait for x time and then show the features...
          var pos_idx = response.chosen_pos; // 0,1 or 2
          var f_rad = choice_img_width/4;
          var f_x = choice_image_x_arr[pos_idx] + 2*f_rad;
          var f_y_arr = [h/2 - 3*f_rad, h/2, h/2 + 3*f_rad];

          var chosen_state_features = c_f_outcomes[position_to_choice_idx[response.chosen_pos]];

          // corresponds to chosen position...
          for (f_idx = 0; f_idx < 3; f_idx++){
            // just put an if here for if you got that feature...
            if (chosen_state_features[f_idx]){
              d3.select("svg").append("circle")
                    .attr("cx", f_x)
                    .attr("cy", f_y_arr[f_idx])
                    .attr("r", f_rad)
                    .attr("fill", feature_colors[f_idx])
                    .style("opacity",1)

              d3.select("svg").append("text")
                          .attr("class", "reward")
                          .attr("x", f_x)
                          .attr("y", f_y_arr[f_idx] + h/120)
                          .attr("font-family","Helvetica")
                          .attr("font-weight","light")
                          .attr("font-size",h/30)
                          .attr("text-anchor","middle")
                          .attr("fill", "white")
                          .style("opacity",1)
                          .text(feature_rewards[f_idx])
                      }
                }

                reward_received = c_rewards[position_to_choice_idx[response.chosen_pos]];

                jsPsych.pluginAPI.setTimeout(function() {
                  d3.select("svg").append("text")
                              .attr("class", "reward")
                              .attr("x", f_x)
                              .attr("y", f_y_arr[2] + h/120 + 2.5*f_rad)
                              .attr("font-family","Helvetica")
                              .attr("font-weight","light")
                              .attr("font-size",h/30)
                              .attr("text-anchor","middle")
                              .attr("fill", "white")
                              .style("opacity",.75)
                              .text(reward_received)

                  if (reward_received < 0){
                    d3.select(".prompt").text("You lost ".concat(-1*reward_received, " points."))
                  }else{
                    d3.select(".prompt").text("You received ".concat(reward_received, " points."))
                  }

                  // wait a second and then display unchosen state feature
                  jsPsych.pluginAPI.setTimeout(function() {
                      display_unchosen_state_features();
                    }, 1000) // how long to wait before moving on to unchosen features
                }, 1500) // how long to wait to show summed reward

              }, 1000) // how long to wait to show chosen features (after choices moves up mo)
      }

      // display unchosen state features
      var display_unchosen_state_features = function(){
        //  500 msec time to move the two features..
        d3.selectAll(unchosen_classes).transition().attr('y',choice_y_stage2).duration(500)
        d3.select(".prompt").text("what you would have gotten from other choices")

        jsPsych.pluginAPI.setTimeout(function() {
          // wait for x time and then show the features...
          for (u_idx = 0; u_idx < unchosen_pos.length; u_idx++){

              pos_idx = unchosen_pos[u_idx]; // 0,1 or 2
              u_state_f_outcomes = c_f_outcomes[position_to_choice_idx[pos_idx]];

              f_rad = choice_img_width/4;
              f_x = choice_image_x_arr[pos_idx] + 2*f_rad;
              f_y_arr = [h/2 - 3*f_rad, h/2, h/2 + 3*f_rad];
              // corresponds to chosen position...
              for (f_idx = 0; f_idx < 3; f_idx++){

                if (u_state_f_outcomes[f_idx]){
                  // just put an if here for if you got that feature...
                    d3.select("svg").append("circle")
                          .attr("cx", f_x)
                          .attr("cy", f_y_arr[f_idx])
                          .attr("r", f_rad)
                          .attr("fill", feature_colors[f_idx])
                          .style("opacity",.1)

                    d3.select("svg").append("text")
                                .attr("class", "reward")
                                .attr("x", f_x)
                                .attr("y", f_y_arr[f_idx] + h/120)
                                .attr("font-family","Helvetica")
                                .attr("font-weight","light")
                                .attr("font-size",h/30)
                                .attr("text-anchor","middle")
                                .attr("fill", "white")
                                .style("opacity",.1)
                                .text(feature_rewards[f_idx])
                        }
                      }
              }

            jsPsych.pluginAPI.setTimeout(function() {

                for (u_idx = 0; u_idx < unchosen_pos.length; u_idx++){
                  var pos_idx = unchosen_pos[u_idx]; // 0,1 or 2
                  var this_total_reward = c_rewards[position_to_choice_idx[pos_idx]];
                  f_x = choice_image_x_arr[pos_idx] + 2*f_rad;

                  d3.select("svg").append("text")
                              .attr("class", "reward")
                              .attr("x", f_x)
                              .attr("y", f_y_arr[2] + h/120 + 2.5*f_rad)
                              .attr("font-family","Helvetica")
                              .attr("font-weight","light")
                              .attr("font-size",h/30)
                              .attr("text-anchor","middle")
                              .attr("fill", "white")
                              .style("opacity",.2)
                              .text(this_total_reward)
                    }

              jsPsych.pluginAPI.setTimeout(function() {
                  // remove the choice class
                  end_trial();
                }, 1500) // how long to wait with everything on screen before trial ends...
            }, 1000) // how long to wait before showing reward
      }, 1500) //
    }// end function display unchosen features



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
                    .style("opacity",.25)
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

      // data to record
      // feature probs, feature rewards, feature outcomes, chosen_pos, chosen_state, rt
      // state_x_feature_x outcome...
      // feature probabilities?
      // feature rewards...
      // total observed rewards...
      var trial_data = {};
      // record the feature rewards on offer...
      for (f_idx = 0; f_idx < 3; f_idx++){
        trial_data["f_".concat(f_idx+1,"_reward")] = trial.feature_rewards[f_idx];
      }
      // record the outcomes for each state..
      for (s_idx = 0; s_idx < 3; s_idx++){
        for (f_idx = 0; f_idx < 3; f_idx++){
          trial_data["s_".concat(s_idx+1,"_f_", f_idx+1, "_outcome")] = 1*c_f_outcomes[s_idx][f_idx];
        }
      }
      // record
      trial_data["chosen_pos"] = response.chosen_pos + 1; // 1,2, or 3
      trial_data["chosen_state"] = position_to_choice_idx[response.chosen_pos] + 1; // 1,2,3
      trial_data["rt"] = response.rt;
      trial_data["reward_received"] = reward_received; // reward we received...
      console.log(trial_data)
      // how much reward was received

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
