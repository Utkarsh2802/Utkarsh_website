import Users from "../Model/Users.js";
import TypingInfo from "../Model/TypingInfo.js";
const Addscore = async function (request, response) {
  //this would run every time the page reloads
  try {
    //var email = request.body.email;
    // console.log(request.cookies);
    var email;
    if (request.cookies != null) {
      //console.log(request.cookies.verifier.verifier);
      const something = await Users.findOne(
        //as there will only be one user
        //find will return a list of objects whereas findone will return a single object
        { verifier: request.cookies.verifier.verifier },
        (err, docs) => {
          if (err) {
            response.send({
              loggednIn: false,
              message:
                "Sorry our servers our down currently please try again in some time",
              error: err,
              status: 400,
              data: {},
            });
          } else {
            if (docs !== null) {
              email = docs.email;
              TypingInfo.findOne({ email: docs.email }, (err, data) => {
                if (data != null) {
                  //console.log(request.body);
                  let alpha = request.body.alpha;
                  let wpm = request.body.wpm;
                  let errors = request.body.errors;
                  let accuracy = request.body.accuarcy;
                  alpha.map((element, index) => {
                    //i will convert it into suitable alphabetschema of the backend
                    let alphabet = String.fromCharCode(97 + index);
                    //console.log(data);
                    return {
                      alphabetname: alphabet,
                      //the below conditional statements are written to avoid undefined error during the first insertion
                      total_errors:
                        data.alpha.lenght > 0
                          ? data.alpha[index].total_errors +
                            element[alphabet][0]
                          : element[alphabet][0],
                      total_count:
                        data.alpha.length > 0
                          ? data.alpha[index].total_count + element[alphabet][1]
                          : element[alphabet][1],
                      accuracy:
                        data.alpha.length > 0
                          ? [
                              ...data.alpha[index].accuarcy,
                              (element[alphabet][0] /
                                (element[alphabet][1] + 1)) *
                                100,
                            ]
                          : [
                              (element[alphabet][0] /
                                (element[alphabet][1] + 1)) *
                                100,
                            ],
                    };
                  });
                  let newvalues = {
                    email: email,
                    tests_taken: data.tests_taken + 1,
                    avg_speed:
                      (data.avg_speed * data.tests_taken + wpm) /
                      (data.tests_taken + 1),
                    avg_error:
                      (data.avg_error * data.tests_taken + errors) /
                      (data.tests_taken + 1),
                    speed_history: [...data.speed_history, wpm],
                    error_history: [...data.error_history, errors],
                    improvement_speed:
                      data.tests_taken > 0
                        ? ((data.avg_speed * data.tests_taken + wpm) /
                            (data.tests_taken + 1) -
                            data.speed_history[0]) /
                          data.tests_taken
                        : 0, //basically improvement speed is 0 if i have not taken any tests otherwise it will be the current avg speed - first test speed divided by the total tests taken
                    alpha: alpha,
                  };
                  console.log(newvalues);
                  console.log("doing");
                  console.log(email);
                  TypingInfo.updateOne(
                    { email: email },
                    newvalues,
                    (err, res) => {
                      if (err) {
                        console.log(err.message);
                      } else {
                        console.log(res);
                        console.log("Done");
                      }
                    }
                  ).catch((err) => {
                    console.log(
                      "some error while updating the typinginfo",
                      err.message
                    );
                  });
                  //now i just need to update my database with these values;
                  response.send({
                    loggedIn: true,
                    status: 200,
                  });
                } else {
                  response.send({ message: "No matching details found" });
                }
              });
            } else {
              response.send({ loggedIn: false, data: {} });
            }
          }
        }
      ).catch((err) => {
        console.log(
          "error called on line 42 of addscore.js in the backend folder"
        );
      });
    } else {
      //this means the cookie was null
      response.send({ loggedIn: false, data: {} });
    }
  } catch (error) {
    response.send({
      message: "Sorry our servers are down currently",
      status: 400,
      error: error.message,
    });
  }
};
export default Addscore;
