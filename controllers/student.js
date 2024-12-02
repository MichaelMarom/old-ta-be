const { marom_db } = require("../db");
const {
  insert,
  findByAnyIdColumn,
  update,
  find,
  parameterizedInsertQuery,
  parameteriedUpdateQuery,
} = require("../utils/crud_queries");
const { shortId } = require("../modules");
require("dotenv").config();
const moment = require("moment-timezone");
const sql = require("mssql");
const {
  capitalizeFirstLetter,
  generateAcademyId,
  generateScreenName,
} = require("../utils/generalHelperFunctions.js");
const studentAd = require("../schema/student/studentAd.js");
const { sendErrors } = require("../utils/handleReqErrors.js");
const StudentSetup1 = require("../schema/student/StudentSetup.js");
const Lessons = require("../schema/common/Lessons.js");
const StudentBank = require("../schema/student/StudentBank.js");
const CodeApplicationLogs = require("../schema/common/CodeApplicationLogs.js");
const Invoice = require("../schema/student/Invoice.js");

const executeQuery = async (query, res) => {
  try {
    await marom_db(async (config) => {
      try {
        const sql = require("mssql");
        const poolConnection = await sql.connect(config);
        if (poolConnection) {
          const result = await poolConnection.request().query(query);
          res.status(200).send(result?.recordset);
        }
      } catch (err) {
        sendErrors(err, res);
      }
    });
  } catch (error) {
    console.error("Error in executeQuery:", error.message);
    return error;
  }
};

// let upload_setup_info = (req, res) => {
//   let {
//     fname,
//     mname,
//     sname,
//     email,
//     lang,
//     secLan,
//     parentAEmail,
//     parentBEmail,
//     parentAName,
//     parentBName,
//     is_18,
//     pwd,
//     cell,
//     grade,
//     add1,
//     add2,
//     city,
//     state,
//     zipCode,
//     country,
//     timeZone,
//     photo,
//     acadId,
//     parentConsent,
//     userId,
//   } = req.body;

//   let UserId =
//     mname?.length > 0
//       ? fname + "." + " " + mname[0] + "." + " " + sname[0] + shortId.generate()
//       : fname + "." + " " + sname[0] + shortId.generate();

//   let screenName =
//     mname?.length > 0
//       ? capitalizeFirstLetter(fname) +
//       " " +
//       capitalizeFirstLetter(mname[0]) +
//       ". " +
//       capitalizeFirstLetter(sname[0])
//       : capitalizeFirstLetter(fname) + ". " + capitalizeFirstLetter(sname[0]);

//   let action = (cb) => {
//     marom_db(async (config) => {
//       const sql = require("mssql");
//       let poolConnection = await sql.connect(config);

//       let result = poolConnection
//         ? await get_action(poolConnection)
//         : "connection error";
//       cb(result);
//     });
//   };

//   action((result) => {
//     if (result) {
//       marom_db(async (config) => {
//         const sql = require("mssql");
//         let poolConnection = await sql.connect(config);

//         insert_student_data(poolConnection)
//           .then((result) => {
//             res.status(200).send({
//               user: UserId,
//               screen_name: screenName,
//               bool: true,
//               mssg: "Data Was Saved Successfully",
//               type: "save",
//             });
//           })
//           .catch((err) => {
//             res.status(400).send({
//               user: UserId,
//               screen_name: screenName,
//               bool: false,
//               mssg: "Data Was Not Saved Successfully Due To Database Malfunction, Please Try Again.",
//             });
//             console.log(err);
//           });
//       });
//     } else {
//       marom_db(async (config) => {
//         const sql = require("mssql");
//         let poolConnection = await sql.connect(config);

//         update_student_data(poolConnection)
//           .then((result) => {
//             res.status(200).send({
//               user: UserId,
//               screen_name: screenName,
//               bool: true,
//               mssg: "Data Was Updated Successfully",
//               type: "update",
//             });
//           })
//           .catch((err) => {
//             res.status(400).send({
//               user: UserId,
//               screen_name: screenName,
//               bool: false,
//               mssg: "Data Was Not Updated Successfully Due To Database Malfunction, Please Try Again.",
//             });
//             console.log(err);
//           });
//       });
//     }
//   });

//   let get_action = async (poolConnection) => {
//     let records = await poolConnection.request()
//       .query(`SELECT * FROM "StudentSetup1"
//         WHERE CONVERT(VARCHAR, Email) = '${email.length > 8 ? email : null}'`);
//     let get_duplicate = await records.recordset;

//     let result = get_duplicate.length > 0 ? false : true;
//     return result;
//   };

//   let insert_student_data = async (poolConnection) => {
//     let records = await poolConnection.request()
//       .query(`INSERT INTO StudentSetup1(FirstName,
//              MiddleName, LastName, Email, Cell, Language, SecLan, ParentAEmail, ParentBEmail,
//              ParentAName, ParentBName,
//              AgeGrade, Grade, Address1, Address2, City, State, ZipCode, Country,  GMT,
//              AcademyId, ScreenName, Photo, Status, ParentConsent, userId)
//         VALUES ('${fname}', '${mname}', '${sname}','${email}','${cell}',
//         '${lang}', '${secLan}', '${parentAEmail}', '${parentBEmail}',
//         '${parentAName}', '${parentBName}','${is_18}', '${grade}', '${add1}','${add2}','${city}','${state}',
//          '${zipCode}',
//         '${country}','${timeZone}',
//          '${UserId}','${screenName}','${photo}', 'pending', '${parentConsent}','${userId}')`);

//     let result = (await records.rowsAffected[0]) === 1 ? true : false;
//     //console.log(result, 'boolean...')
//     return result;
//   };

//   let update_student_data = async (poolConnection) => {
//     let records = await poolConnection.request().query(`UPDATE "StudentSetup1"
//         set Photo = '${photo}', Address1 = '${add1}', Address2 = '${add2}', City = '${city}',
//          State = '${state}', ZipCode = '${zipCode}', Country = '${country}',
//           Email = '${email}', Cell = '${cell}', FirstName='${fname}',LastName='${sname}',
//           MiddleName='${mname}', GMT = '${timeZone}', Language='${lang}', AgeGrade='${is_18}',
//          Grade='${grade}', ParentConsent='${parentConsent}', SecLan = '${secLan}',
//          ParentAEmail='${parentAEmail}', ParentBEmail='${parentBEmail}',
//           ParentAName='${parentAName}', ParentBName='${parentBName}', ScreenName= '${screenName}'
//           WHERE CONVERT(VARCHAR, AcademyId) = '${acadId}'`);

//     let result = (await records.rowsAffected[0]) === 1 ? true : false;
//     return result;
//   };
// };

const post_student_setup = (req, res) => {
  marom_db(async (config) => {
    try {
      let AcademyId = generateAcademyId(
        req.body["FirstName"],
        req.body["LastName"],
        req.body["MiddleName"]
      );

      let ScreenName = generateScreenName(
        req.body["FirstName"],
        req.body["LastName"],
        req.body["MiddleName"]
      );

      const updatedBody = { ...req.body, AcademyId, ScreenName };

      const poolConnection = await sql.connect(config);
      const request = poolConnection.request();

      Object.keys(updatedBody).map((key) => {
        request.input(key, StudentSetup1[key], updatedBody[key]);
      });
      const result = await request.query(
        parameterizedInsertQuery("StudentSetup1", updatedBody).query
      );

      res.status(200).send(result.recordset);
    } catch (e) {
      sendErrors(e, res);
    }
  });
};

const post_student_setup_at_signup = (req, res) => {
  marom_db(async (config) => {
    try {
      let AcademyId = generateAcademyId(
        req.body["FirstName"],
        req.body["LastName"],
        req.body["MiddleName"]
      );

      let ScreenName = generateScreenName(
        req.body["FirstName"],
        req.body["LastName"],
        req.body["MiddleName"]
      );

      const updatedBody = { ...req.body, AcademyId, ScreenName };

      const poolConnection = await sql.connect(config);
      const request = poolConnection.request();

      Object.keys(updatedBody).map((key) => {
        request.input(key, StudentSetup1[key], updatedBody[key]);
      });
      const result = await request.query(
        parameterizedInsertQuery("StudentSetup1", updatedBody).query
      );

      res.status(200).send(result.recordset);
    } catch (e) {
      sendErrors(e, res);
    }
  });
};

const upload_student_by_field = (req, res) => {
  marom_db(async (config) => {
    try {
      const { id } = req.params;
      const poolConnection = await sql.connect(config);
      const request = poolConnection.request();
      // const { recordset } =
      //   await request.query(`SELECT * FROM "StudentSetup1" WHERE AcademyId
      //           = '${id}'`);
      // if (!recordset.length) throw new Error("Student does not exist");

      Object.keys({ ...req.body, AcademyId: id }).map((key) => {
        request.input(
          key,
          StudentSetup1[key],
          { ...req.body, AcademyId: id }[key]
        );
      });
      const result = await request.query(
        parameteriedUpdateQuery(
          "StudentSetup1",
          req.body,
          { AcademyId: id },
          {},
          false
        ).query
      );

      res.status(200).send({
        message: result.rowsAffected[0]
          ? "Updated Sucessfully"
          : "No Record Found",
      });
    } catch (e) {
      sendErrors(e, res);
    }
  });
};

let get_student_setup = (req, res) => {
  marom_db(async (config) => {
    let poolConnection = await sql.connect(config);
    if (poolConnection) {
      poolConnection
        .request()
        .query(`Select 
          SS.*, US.email 
          from 
          StudentSetup1 SS 
          join 
          Users1 US 
          on SS.userId=US.SID
          where SS.userId = '${req.query.userId}'`)
        .then((result) => {
          const { recordset } = result;
          if (recordset.length) {
            let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (recordset?.[0]?.GMT) {
              const match = recordset?.[0]?.GMT.match(
                /^([+-]\d{2})(?::(\d{2}))?$/
              );
              if (match) {
                const hours = parseInt(match[1], 10);
                const minutes = match[2] ? parseInt(match[2], 10) : 0;

                const offset = hours * 60 + minutes;

                const timezones = moment.tz
                  .names()
                  .filter((name) => moment.tz(name).utcOffset() === offset);
                timeZone = timezones?.[0] || timeZone;
              }
            }
            const formattedResult = [{ ...recordset[0], timeZone }];
            res.status(200).send(formattedResult);
          } else res.status(200).send([{}]);
        })
        .catch((err) => {
          sendErrors(err, res);
        });
    }
  });
};

// let get_student_grade = (req, res) => {
//     marom_db(async (config) => {
//         const sql = require('mssql');

//         let poolConnection = await sql.connect(config);
//         // console.log(poolConnection._connected)
//         if (poolConnection) {
//             poolConnection.request().query(
//                 `
//                     SELECT * From Grade
//                 `
//             )
//                 .then((result) => {
//                     res.status(200).send(result.recordset)
//                     //result.recordset.map(item => item.AcademyId === user_id ? item : null)
//                 })
//             //   .catch(err => console.log(err))

//         }

//     })
// }

let get_tutor_subject = async (req, res) => {
  try {
    marom_db(async (config) => {
      try {
        let { subject } = req.query;

        const poolConnection = await sql.connect(config);
        if (poolConnection) {
          const subjects = await poolConnection.request().query(`SELECT 
                    SubjectRates.*,
                    edu.*,
                    TutorSetup.ResponseHrs as responseTime, 
                    TutorSetup.Status as status,
                    Discounts.CancellationPolicy as cancPolicy
                    FROM SubjectRates
                    JOIN TutorSetup ON cast(TutorSetup.AcademyId as varchar(max)) = 
                    cast(SubjectRates.AcademyId as varchar(max))
                    JOIN Discounts ON cast(Discounts.AcademyId as varchar(max)) = 
                    cast(SubjectRates.AcademyId as varchar(max))
                    JOIN Education1 as edu ON
                    cast(TutorSetup.AcademyId as varchar(max)) =  cast(edu.AcademyId as varchar(max))
                    WHERE CONVERT(VARCHAR, SubjectRates.faculty) = '${subject}' and
                    TutorSetup.Status = 'active'
                    `);

          res.status(200).send(subjects.recordset);
        }
      } catch (err) {
        sendErrors(err, res);
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
};

const get_tutor_by_subject_faculty = async (req, res) => {
  marom_db(async (config) => {
    try {
      let { subjectName, facultyId, studentId } = req.params;

      const poolConnection = await sql.connect(config);
      if (poolConnection) {
        const subjects = await poolConnection.request().query(`
                SELECT 
                SR.rate,
                SR.grades,

                TS.Photo, 
                TS.ResponseHrs, 
                TS.FirstName,
                TS.LastName,
                TS.TutorScreenname,
                TS.Status as status,
                TS.AcademyId,
                TS.Country,
                TS.GMT,
                TS.disableColor,
                TS.VacationMode,
                TS.StartVacation,
                TS.EndVacation,
                
                DS.CancellationPolicy,
                DS.IntroSessionDiscount,
                DS.ActivateSubscriptionOption,
                
                5 as  DiscountHours,
                
                CAL.CodeApplied,
                CAL.SubjectRateCodeRef,

                ch.ChatID
            FROM 
                SubjectRates as SR 
            JOIN 
                TutorSetup as TS ON cast(TS.AcademyId as varchar(max)) = cast(SR.AcademyId as varchar(max))
            LEFT JOIN 
                Discounts as DS ON cast(DS.AcademyId as varchar(max)) = cast(SR.AcademyId as varchar(max))
            LEFT JOIN
                Chat as ch on ch.User2ID = cast(SR.AcademyId as varchar(max)) and ch.User1ID = '${studentId}'
            JOIN 
                Education1 as edu ON cast(TS.AcademyId as varchar(max)) = cast(edu.AcademyId as varchar(max))
            LEFT JOIN 
                CodeApplicationLogs  as CAL ON 
                    cast(CAL.tutorId as varchar(max)) = cast(TS.AcademyId as varchar(max)) and
                    SR.SID = CAL.SubjectRateCodeRef and
                    cast(CAL.studentId as varchar)= '${studentId}' and
                   cast( SR.subject as varchar(max)) = '${subjectName}'

            WHERE 
                CONVERT(VARCHAR, SR.faculty) = '${facultyId}' 
                AND TS.Status = 'active' 
                AND cast( SR.subject as varchar(max)) = '${subjectName}'`);


        res.status(200).send(subjects.recordset);
      }
    } catch (err) {
      sendErrors(err, res);
    }
  });
};

// let upload_student_short_list = async (req, res) => {
//   marom_db(async (config) => {
//     try {
//       const { Subject, Student, AcademyId } = req.body;
//       const poolConnection = await sql.connect(config);

//       const result = await poolConnection.request().query(
//         find("StudentShortList", { Subject, Student, AcademyId }, "And", {
//           Subject: "varchar",
//           Student: "varchar",
//           AcademyId: "varchar",
//         })
//       );

//       if (!result.recordset.length) {
//         const { recordset } = await poolConnection
//           .request()
//           .query(insert("StudentShortList", req.body));
//         res.status(200).send(recordset);
//       }
//       res.status(200).send(result.recordset);
//     } catch (err) {
//       sendErrors(err, res);
//     }
//   });
// };

// const get_student_short_list = async (req, res) => {
//     try {
//         marom_db(async (config) => {
//             let poolConnection = await sql.connect(config);
//             let result = await poolConnection.request().query(
//                 `SELECT SSL.*, TR.*, SR.rate as rate, TS.*
//                 FROM StudentShortList SSL
//                 left JOIN Discounts TR ON
//                     CONVERT(VARCHAR(MAX), SSL.AcademyId) = CONVERT(VARCHAR(MAX), TR.AcademyId)
//                 join TutorSetup as TS ON
//                     CONVERT(VARCHAR(MAX), SSL.AcademyId) = CONVERT(VARCHAR(MAX), TS.AcademyId)
//                 inner join SubjectRates as SR ON
//                     cast(SR.AcademyId as VARCHAR(MAX)) =  cast( TR.AcademyId as VARCHAR(MAX)) and
//                     cast(SR.subject as VARCHAR(MAX)) =  cast( SSL.Subject as VARCHAR(MAX))
//                 WHERE cast( SSL.Student as varchar) = cast('${req.params.student}' as varchar) AND
//                 TS.Status = 'active'
//                 `
//             );

//             res.status(200).send(result.recordset);
//         })
//     } catch (err) {
//         sendErrors(err, res)
//     }
// };

// const update_shortlist = async (req, res) => {
//     try {
//         const query = update("StudentShortList", req.body, req.params, {
//             AcademyId: "varchar",
//             Student: "varchar", Subject: "varchar"
//         })
//         const result = await executeQuery(query, res);
//         if (result?.recordset?.length === 0) {
//             throw new Error('Update failed: Record not found');
//         }
//         // res.status(200).send(result?.recordset)
//     } catch (error) {
//         console.error('Error in updateRecord:', error.message);
//         res.status(400).send(error)

//     }
// }

let get_my_data = async (req, res) => {
  let { AcademyId } = req.query;
  marom_db(async (config) => {
    try {
      let poolConnection = await sql.connect(config);

      const result = await poolConnection.request()
        .query(`SELECT SS.*, US.email from StudentSetup1 SS join Users1 US on US.SID = SS.userId
            WHERE CONVERT(VARCHAR, SS.AcademyId) = '${AcademyId}' `);
      let record = result.recordset[0] || {};
      if (record.userId) {
        const { recordset } = await poolConnection
          .request()
          .query(findByAnyIdColumn("Users1", { SID: record.userId }));
        record = { ...record, Email: recordset[0].email };

        const offset = parseInt(record.GMT, 10);
        let timezones = moment.tz
          .names()
          .filter((name) => moment.tz(name).utcOffset() === offset * 60);
        const timeZone = timezones[0] || null;

        res.status(200).send({ ...record, timeZone });
      } else {
        res.status(200).send({});
      }
    } catch (err) {
      sendErrors(err, res);
    }
  });
};

// let get_student_short_list_data = (req, res) => {
//     marom_db(async (config) => {
//         const poolConnection = await sql.connect(config)
//         poolConnection.request().query(`SELECT * From StudentShortList WHERE CONVERT(VARCHAR, Student) = '${req.query.id}'`)
//             .then((result) => {
//                 res.send(result.recordset);
//             })
//             .catch(err => {
//                 sendErrors(err, res)
//             })
//     })
// }

const post_student_ad = async (req, res) => {
  try {
    marom_db(async (config) => {
      try {
        const poolConnection = await sql.connect(config);
        const request = poolConnection.request();

        Object.keys(req.body).forEach((key) => {
          request.input(key, studentAd[key], req.body[key]);
        });

        const result = await request.query(
          parameterizedInsertQuery("StudentAds", req.body).query
        );

        res.status(200).send(result.recordset[0]);
      } catch (err) {
        sendErrors(err, res);
      }
    });
  } catch (err) {
    sendErrors(err, res);
  }
};

const get_student_ads = async (req, res) => {
  try {
    marom_db(async (config) => {
      try {
        const poolConnection = await sql.connect(config);
        const request = poolConnection.request();

        const { recordset } = await request.query(
          find("StudentAds", { AcademyId: req.params.id })
        );

        recordset.sort(
          (a, b) => new Date(b.Published_At) - new Date(a.Published_At)
        );

        res.status(200).send(recordset);
      } catch (err) {
        sendErrors(err, res);
      }
    });
  } catch (err) {
    sendErrors(err, res);
  }
};

let get_student_market_data = async (req, res) => {
  try {
    marom_db(async (config) => {
      try {
        const poolConnection = await sql.connect(config);
        const { recordset } = await poolConnection
          .request()
          .query(`SELECT * FROM Faculty `);
        recordset.sort((a, b) => {
          if (a.Faculty < b.Faculty) return -1;
          if (a.Faculty > b.Faculty) return 1;
          return 0;
        });

        res.status(200).send(recordset);
      } catch (err) {
        sendErrors(err, res);
      }
    });
  } catch (err) {
    sendErrors(err, res);
  }
};

const get_ad = async (req, res) => {
  marom_db(async (config) => {
    try {
      const poolConnection = await sql.connect(config);
      const result = await poolConnection
        .request()
        .query(findByAnyIdColumn("StudentAds", { Id: req.params.id }));
      res.status(200).send(result.recordset[0]);
    } catch (e) {
      sendErrors(err, res);
    }
  });
};

const put_ad = async (req, res) => {
  marom_db(async (config) => {
    try {
      const poolConnection = await sql.connect(config);
      const request = poolConnection.request();
      request.input("Id", studentAd["Id"], req.params.id);

      Object.keys(req.body).map((key) => {
        request.input(key, studentAd[key], req.body[key]);
      });
      const result = await request.query(
        parameteriedUpdateQuery(
          "StudentAds",
          req.body,
          { Id: req.params.id },
          false
        ).query
      );

      res.status(200).send(result.recordset);
    } catch (e) {
      sendErrors(err, res);
    }
  });
};

// const post_student_bookings = async (req, res) => {
//   const { tutorId, studentId } = req.body;
//   marom_db(async (config) => {
//     try {
//       const poolConnection = await sql.connect(config);
//       if (tutorId && studentId) {
//         poolConnection
//           .request()
//           .query(find("StudentBookings", { studentId, tutorId }))
//           .then((result) => {
//             if (result.recordset.length) {
//               poolConnection
//                 .request()
//                 .query(
//                   update("StudentBookings", req.body, {
//                     studentId: req.body.studentId,
//                     tutorId: req.body.tutorId,
//                   })
//                 )
//                 .then((result) => res.send(result.recordset))
//                 .catch((err) => console.log(err));
//             } else {
//               poolConnection
//                 .request()
//                 .query(insert("StudentBookings", req.body))
//                 .then((result) => {
//                   res.status(200).send(result.recordset);
//                 })
//                 .catch((err) => {
//                   sendErrors(err, res);
//                 });
//             }
//           })
//           .catch((err) => {
//             sendErrors(err, res);
//           });
//       } else {
//         throw new Error("Missing tutorId/studentId");
//       }
//     } catch (err) {
//       sendErrors(err, res);
//     }
//   });
// };

// const get_student_or_tutor_bookings = async (req, res) => {
//   marom_db(async (config) => {
//     const { tutorId, studentId } = req.params;
//     const poolConnection = await sql.connect(config);
//     poolConnection
//       .request()
//       .query(find("StudentBookings", { studentId, tutorId }, "OR"))
//       .then((result) => {
//         res.send(result.recordset);
//       })
//       .catch((err) => {
//         sendErrors(err, res);
//       });
//   });
// };

// const get_student_bookings = async (req, res) => {
//   marom_db(async (config) => {
//     const { studentId } = req.params;
//     const poolConnection = await sql.connect(config);
//     poolConnection
//       .request()
//       .query(find("StudentBookings", { studentId }))
//       .then((result) => {
//         res.status(200).send(result.recordset);
//       })
//       .catch((err) => {
//         sendErrors(err, res);
//       });
//   });
// };

//lesson
const post_student_lesson = async (req, res) => {
  marom_db(async (config) => {
    try {
      const poolConnection = await sql.connect(config);
      const request = poolConnection.request();

      // const invoiceNum = `${req.body.studentId.replace(
      //   " ",
      //   ""
      // )}${shortId.generate()}`.replace(" ", "");

      Object.keys({ ...req.body }).forEach((key) => {
        request.input(key, Lessons[key], { ...req.body }[key]);
      });

      const result = await request.query(
        parameterizedInsertQuery("Lessons", { ...req.body }).query
      );
      res.status(200).send(result.recordset);
    } catch (err) {
      sendErrors(err, res);
    }
  });
};

const update_student_lesson = async (req, res) => {
  marom_db(async (config) => {
    try {
      const { id } = req.params;
      const poolConnection = await sql.connect(config);
      const request = poolConnection.request();

      Object.keys({ ...req.body, id }).forEach((key) => {
        request.input(key, Lessons[key], { ...req.body, id }[key]);
      });

      const result = await request.query(
        parameteriedUpdateQuery("Lessons", req.body, req.params, {}, false)
          .query
      );
      res.status(200).send(result);
    } catch (err) {
      sendErrors(err, res);
    }
  });
};

const delete_student_lesson = async (req, res) => {
  marom_db(async (config) => {
    try {
      const { id } = req.params;
      const poolConnection = await sql.connect(config);
      const request = poolConnection.request();

      const result = await request.query(
        `Delete  from Lessons where id = '${id}'`
      );
      res.status(200).send(result);
    } catch (err) {
      sendErrors(err, res);
    }
  });
};

const post_student_invoice = async (req, res) => {
  marom_db(async (config) => {
    try {
      const poolConnection = await sql.connect(config);
      const request = poolConnection.request();

      Object.keys(req.body).map(key => {
        request.input(key, Invoice[key], req.body[key]);
      })
      const { recordset } = await request.query(
        parameterizedInsertQuery("Invoice", req.body).query
      );
      res.status(200).send(recordset);
    } catch (err) {
      sendErrors(err, res);
    }
  });
};
const post_student_invoice_and_lessons = async (req, res) => {
  marom_db(async (config) => {
    const transaction = new sql.Transaction();
    try {
      await transaction.begin(); // Start transaction

      const { invoice, lessons } = req.body;

      // Step 1: Insert into Invoice table
      const invoiceQuery = parameterizedInsertQuery("Invoice", invoice);
      const invoiceRequest = new sql.Request(transaction); // Create a new request for Invoice

      Object.keys(invoice).forEach((key) => {
        invoiceRequest.input(key, Invoice[key], invoice[key]);
      });

      const invoiceResult = await invoiceRequest.query(invoiceQuery.query);
      const invoiceId = invoiceResult.recordset[0].InvoiceId; // Retrieve the InvoiceId

      // Step 2: Insert Lessons linked to the InvoiceId
      for (const lesson of lessons) {
        const lessonWithInvoice = { ...lesson, invoiceNum: invoiceId };
        const lessonQuery = lesson.type === 'intro' ?
          parameterizedInsertQuery("Lessons", lessonWithInvoice) :
          parameteriedUpdateQuery("Lessons", lesson, { id: lesson.id }, {}, false)

        const lessonRequest = new sql.Request(transaction); // Create a new request for each Lesson
        Object.keys(lessonWithInvoice).forEach((key) => {
          lessonRequest.input(key, Lessons[key], lessonWithInvoice[key]);
        });

        await lessonRequest.query(lessonQuery.query); // Execute the query
      }

      // Commit the transaction
      await transaction.commit();
      res.status(200).send({ success: true, invoiceId });
    } catch (err) {
      // Rollback in case of an error
      await transaction.rollback();
      sendErrors(err, res);
    }
  });
};

const update_student_invoice_and_lessons = async (req, res) => {
  marom_db(async (config) => {
    const transaction = new sql.Transaction();
    try {
      await transaction.begin(); // Start transaction

      const { invoice, lesson } = req.body.params;

      // Step 1: Insert into Invoice table
      const invoiceQuery = parameterizedInsertQuery("Invoice", invoice);
      const invoiceRequest = new sql.Request(transaction); // Create a new request for Invoice

      Object.keys(invoice).forEach((key) => {
        invoiceRequest.input(key, Invoice[key], invoice[key]);
      });

      const invoiceResult = await invoiceRequest.query(invoiceQuery.query);
      const invoiceId = invoiceResult.recordset[0].InvoiceId; // Retrieve the InvoiceId

      // Step 2: Insert Lessons linked to the InvoiceId
      const lessonWithInvoice = { ...lesson, invoiceNum: invoiceId };
      const lessonQuery = parameteriedUpdateQuery("Lessons", lessonWithInvoice, req.params, {}, false);

      const lessonRequest = new sql.Request(transaction); // Create a new request for each Lesson
      Object.keys(lessonWithInvoice).forEach((key) => {
        lessonRequest.input(key, Lessons[key], lessonWithInvoice[key]);
      });

      await lessonRequest.query(lessonQuery.query);

      await transaction.commit();
      res.status(200).send({ success: true, invoiceId });
    } catch (err) {
      await transaction.rollback();
      sendErrors(err, res);
    }
  });
};

const put_student_invoice = async (req, res) => {
  marom_db(async (config) => {
    try {
      const poolConnection = await sql.connect(config);
      const request = poolConnection.request();
      const { id } = req.params;

      Object.keys({ ...req.body, InvoiceId: id }).map(key => {
        request.input(key, Invoice[key], { ...req.body, InvoiceId: id }[key]);
      })
      const result = await request.query(
        parameteriedUpdateQuery("Invoice", req.body, { InvoiceId: id }, {}, false).query
      );
      res.status(200).send(result);
    } catch (err) {
      sendErrors(err, res);
    }
  });
};

const get_student_lessons = async (req, res) => {
  marom_db(async (config) => {
    try {
      const { studentId, tutorId } = req.query;
      const poolConnection = await sql.connect(config);
      const request = poolConnection.request();

      const result = await request.query(
        find("Lessons", { studentId, tutorId }, "OR")
      );
      res.status(200).send(result.recordset);
    } catch (err) {
      sendErrors(err, res);
    }
  });
};

const get_tutor_bookings = async (req, res) => {
  marom_db(async (config) => {
    const { tutorId } = req.params;
    const poolConnection = await sql.connect(config);
    poolConnection
      .request()
      .query(find("Lessons", { tutorId }))
      .then((result) => {
        res.send(result.recordset);
      })
      .catch((err) => {
        sendErrors(err, res);
      });
  });
};

const get_student_bank_details = async (req, res) => {
  marom_db(async (config) => {
    try {
      const sql = require("mssql");
      const poolConnection = await sql.connect(config);

      if (poolConnection) {
        const result = await poolConnection
          .request()
          .query(findByAnyIdColumn("StudentBank", req.params, "Varchar"));

        res.status(200).send(result.recordset);
      }
    } catch (err) {
      sendErrors(err, res);
    }
  });
};

const put_student_bank_details = async (req, res) => {
  marom_db(async (config) => {
    try {
      const poolConnection = await sql.connect(config);

      if (poolConnection) {
        const request = await poolConnection.request();

        Object.keys({ ...req.body, AcademyId: req.params.id }).forEach(
          (key) => {
            request.input(
              key,
              StudentBank[key],
              { ...req.body, AcademyId: req.params.id }[key]
            );
          }
        );

        const result = await request.query(
          parameteriedUpdateQuery(
            "StudentBank",
            req.body,
            { AcademyId: req.params.id },
            {},
            false
          ).query
        );

        res
          .status(200)
          .send({ updated: result.rowsAffected, result: result.recordset });
      }
    } catch (err) {
      sendErrors(err, res);
    }
  });
};

const post_student_bank_details = async (req, res) => {
  marom_db(async (config) => {
    try {
      const sql = require("mssql");
      const poolConnection = await sql.connect(config);

      if (poolConnection) {
        const result = await poolConnection
          .request()
          .query(
            findByAnyIdColumn(
              "StudentBank",
              { AcademyId: req.body.AcademyId },
              "varchar"
            )
          );
        if (result.recordset.length) {
          await poolConnection
            .request()
            .query(
              update("StudentBank", req.body, { AcademyId: req.body.AcademyId })
            );
        } else {
          await poolConnection.request().query(insert("StudentBank", req.body));
        }

        res.status(200).send(result.recordset);
      }
    } catch (err) {
      sendErrors(err, res);
    }
  });
};

const get_student_feedback = async (req, res) => {
  marom_db(async (config) => {
    try {
      const sql = require("mssql");
      const poolConnection = await sql.connect(config);

      if (poolConnection) {
        const result = await poolConnection
          .request()
          .query(findByAnyIdColumn("Feedback", req.params, "Varchar"));
        res.status(200).send(result.recordset);
      }
    } catch (err) {
      sendErrors(err, res);
    }
  });
};

const post_student_feedback = async (req, res) => {
  marom_db(async (config) => {
    try {
      const sql = require("mssql");
      const poolConnection = await sql.connect(config);

      if (poolConnection) {
        const result = await poolConnection
          .request()
          .query(
            findByAnyIdColumn(
              "Feedback",
              { AcademyId: req.body.ShortlistId },
              "varchar"
            )
          );
        if (result.recordset.length) {
          await poolConnection.request().query(
            update("StudentBank", req.body, {
              AcademyId: req.body.ShortlistId,
            })
          );
        } else {
          await poolConnection.request().query(insert("Feedback", req.body));
        }

        res.status(200).send(result.recordset);
      }
    } catch (err) {
      sendErrors(err, res);
    }
  });
};

// const payment_report = async (req, res) => {
//   const { studentId } = req.params;
//   marom_db(async (config) => {
//     try {
//       const sql = require("mssql");
//       const poolConnection = await sql.connect(config);

//       if (poolConnection) {
//         const result = await poolConnection.request().query(
//           `SELECT
//                     b.studentId AS studentId,
//                     b.tutorId AS tutorId,
//                     b.reservedSlots AS reservedSlots,
//                     b.bookedSlots AS bookedSlots,
//                     r.rate AS rate,
//                     ts.Photo
//                      FROM StudentBookings AS b
//                      JOIN StudentShortList AS r ON
//                      b.studentId  = CAST( r.Student as varchar(max)) AND
//                      b.tutorId =  CAST(r.AcademyId as varchar(max))
//                      inner join TutorSetup AS ts On
//                      ts.AcademyId = CAST(r.AcademyId as varchar(max))
//                     WHERE b.studentId = CAST('${studentId}' as varchar(max)); `
//         );

//         res.status(200).send(result.recordset);
//       }
//     } catch (err) {
//       console.log(err);
//       sendErrors(err, res);
//     }
//   });
// };

const get_feedback_questions = async (req, res) => {
  marom_db(async (config) => {
    try {
      const poolConnection = await sql.connect(config);

      if (poolConnection) {
        const result = await poolConnection.request().query(
          find("FeedbackQuestions", {
            ForStudents: req.params.isStudentLoggedIn,
          })
        );

        res.status(200).send(result.recordset);
      }
    } catch (err) {
      sendErrors(err, res);
    }
  });
};

const get_feedback_of_questions = async (req, res) => {
  marom_db(async (config) => {
    try {
      const sql = require("mssql");
      const poolConnection = await sql.connect(config);

      if (poolConnection) {
        const result = await poolConnection.request().query(
          `SELECT fq.questionText as questionText, f.rating as star, fq.SID as SID
                  FROM Feedback f
                  JOIN feedbackQuestions fq ON f.feedbackQuestionsId = fq.SID
                  WHERE f.StudentId = '${req.params.StudentId}'
                  AND f.TutorId = '${req.params.TutorId}'
                  AND f.SessionId = '${req.params.SessionId}' 
                  AND f.IsStudentGiver = ${req.params.isstudentgiver}`
        );

        res.status(200).send(result.recordset);
      }
    } catch (err) {
      sendErrors(err, res);
    }
  });
};

const post_feedback_questions = async (req, res) => {
  marom_db(async (config) => {
    try {
      const sql = require("mssql");
      const poolConnection = await sql.connect(config);
      if (poolConnection) {
        let result;
        result = await poolConnection.request().query(
          `SELECT * FROM Feedback WHERE SessionId = '${req.body.SessionId}'
                     AND TutorId = '${req.body.TutorId}' AND FeedBackQuestionsId = ${req.body.FeedbackQuestionsId}`
        );
        if (result.recordset.length) {
          result = await poolConnection.request().query(
            update("Feedback", req.body, {
              SessionId: req.body.SessionId,
              TutorId: req.body.TutorId,
              FeedBackQuestionsId: req.body.FeedbackQuestionsId,
            })
          );
        } else {
          result = await poolConnection
            .request()
            .query(insert("Feedback", req.body));
        }

        res.status(200).send(result.recordset);
      }
    } catch (err) {
      console.log(err);
      sendErrors(err, res);
    }
  });
};

// function getBookedSlot(req, res) {
//   let { AcademyId } = req.query;
//   marom_db(async (config) => {
//     try {
//       const sql = require("mssql");

//       let poolConnection = await sql.connect(config);
//       if (poolConnection) {
//         const result = await poolConnection.request().query(
//           `
//                     SELECT bookedSlots From StudentBookings
//                     WHERE CONVERT(VARCHAR, studentId) = '${AcademyId}'
//                 `
//         );
//         res.status(200).send(result.recordset);
//       }
//     } catch (err) {
//       sendErrors(err, res);
//     }
//   });
// }

const post_student_agreement = async (req, res) => {
  marom_db(async (config) => {
    try {
      const sql = require("mssql");
      const poolConnection = await sql.connect(config);
      if (poolConnection) {
        const result = await poolConnection
          .request()
          .query(update("StudentSetup1", req.body, req.params));
        res.status(200).send(result.recordset);
      }
    } catch (err) {
      console.log(err);
      sendErrors(err, res);
    }
  });
};

const update_student_agreement_to_null = async (req, res) => {
  marom_db(async (config) => {
    try {
      const poolConnection = await sql.connect(config);
      if (poolConnection) {
        const result = await poolConnection
          .request()
          .query("Update StudentSetup1 set AgreementDate = null");
        res.status(200).send(result.recordset);
      }
    } catch (err) {
      console.log(err);
      sendErrors(err, res);
    }
  });
};

const get_student_photos = async (req, res) => {
  marom_db(async (config) => {
    try {
      const { AcademyIds } = req.query;
      const poolConnection = await sql.connect(config);
      if (poolConnection) {
        const { recordset } = await poolConnection
          .request()
          .query(
            `SELECT Photo, AcademyId FROM  StudentSetup1 WHERE AcademyId in (${AcademyIds.map(
              (id) => `'${id}'`
            )})`
          );

        res.status(200).send(recordset);
      }
    } catch (err) {
      console.log(err);
      sendErrors(err, res);
    }
  });
};

const set_code_applied = async (req, res) => {
  marom_db(async (config) => {
    try {
      const poolConnection = await sql.connect(config);
      if (poolConnection) {
        // const { recordset: tutorRateRecord } = await poolConnection
        //   .request()
        //   .query(
        //     find("SubjectRates", { AcademyId: req.params.tutorId }, "AND", {
        //       AcademyId: "varchar",
        //     })
        //   );
        // if (tutorRateRecord[0].CodeStatus === "used")
        //   throw new Error("Code Already Used!");

        const { recordset: updatedTutorRateRecord } = await poolConnection
          .request()
          .query(
            update(
              "SubjectRates",
              { CodeStatus: "used" },
              { AcademyId: req.params.tutorId, SID: req.body.params.SubjectRateCodeRef },
              { AcademyId: "varchar" }
            )
          );
        if (!updatedTutorRateRecord.length)
          throw new Error("Code does not exist!");



        const request = await poolConnection.request();

        request.input("codeApplied", CodeApplicationLogs["codeApplied"], true)
        request.input("tutorId", CodeApplicationLogs["tutorId"], req.params.tutorId)
        request.input("studentId", CodeApplicationLogs["studentId"], req.params.studentId)
        request.input("SubjectRateCodeRef", CodeApplicationLogs["SubjectRateCodeRef"], req.body.params.SubjectRateCodeRef)


        const { rowsAffected } = await request.query(parameteriedUpdateQuery("CodeApplicationLogs", { codeApplied: true },
          {
            tutorId: req.params.tutorId,
            studentId: req.params.studentId,
            SubjectRateCodeRef: req.body.params.SubjectRateCodeRef,
          }
          , {}, false
        ).query)

        if (!rowsAffected[0])
          await request.query(
            parameterizedInsertQuery("CodeApplicationLogs", {
              codeApplied: true,
              tutorId: req.params.tutorId,
              studentId: req.params.studentId,
              SubjectRateCodeRef: req.body.params.SubjectRateCodeRef,
            }).query
          );

        res
          .status(200)
          .send({ message: "Code applied succesfully" });
      }
    } catch (err) {
      sendErrors(err, res);
    }
  });
};

const get_published_ads = async (req, res) => {
  marom_db(async (config) => {
    try {
      const sql = require("mssql");
      const poolConnection = await sql.connect(config);
      if (poolConnection) {
        const { recordset } = await poolConnection.request().query(
          `select 
          TA.*, TS.Photo, TS.TutorScreenname
          from 
          TutorAds as TA 
          join
          TutorSetup as TS on 
          cast(TS.AcademyId as varchar) = TA.AcademyId
          where 
          TS.Status = 'active' and TA.Published_At is not null   `
        );

        recordset.sort(
          (a, b) => new Date(b.Published_At) - new Date(a.Published_At)
        );

        res.status(200).send(recordset);
      }
    } catch (err) {
      console.log(err);
      sendErrors(err, res);
    }
  });
};

const ad_to_shortlist = async (req, res) => {
  marom_db(async (config) => {
    try {
      const poolConnection = await sql.connect(config);
      const { recordset } = await poolConnection
        .request()
        .query(find("AdShortlist", req.body));
      if (!recordset.length) {
        const { recordset } = await poolConnection
          .request()
          .query(insert("AdShortlist", req.body));
        res.status(200).send(recordset);
      }
      res.status(200).send(recordset);
    } catch (err) {
      sendErrors(err, res);
    }
  });
};

const get_shortlist_ads = async (req, res) => {
  marom_db(async (config) => {
    try {
      const poolConnection = await sql.connect(config);
      const { recordset } = await poolConnection.request().query(
        `select TA.*, 
        TS.Photo, 
        TS.TutorScreenname 
        from 
        AdShortlist as ASL join 
        TutorAds as TA on
        TA.Id = ASL.AdId join
        TutorSetup as TS on 
        cast(TS.AcademyId as varchar) = TA.AcademyId
        where ASL.StudentId = '${req.params.studentId}'`
      );
      recordset.sort(
        (a, b) => new Date(b.Published_At) - new Date(a.Published_At)
      );

      res.status(200).send(recordset);
    } catch (err) {
      sendErrors(err, res);
    }
  });
};

const delete_ad_from_shortlist = async (req, res) => {
  marom_db(async (config) => {
    try {
      const poolConnection = await sql.connect(config);
      const data = await poolConnection
        .request()
        .query(
          `delete from AdShortlist where StudentId = '${req.params.studentId}' and AdId = ${req.params.adId}`
        );
      res.status(200).send(data);
    } catch (err) {
      sendErrors(err, res);
    }
  });
};

const get_all_students_sessions_formatted = async (req, res) => {
  marom_db(async (config) => {
    try {
      const { studentId } = req.params;
      const poolConnection = await sql.connect(config);
      const { recordset } = await poolConnection.request()
        .query(`select ls.*, ss.GMT
        from Lessons as ls
        join StudentSetup1 as ss on
        cast(ss.AcademyId as varchar) = ls.studentId
        where ls.studentId = '${studentId}'`);
      if (recordset.length) {
        //timeZone
        const offset = parseInt(recordset[0].GMT, 10);
        let timezones = moment.tz
          .names()
          .filter((name) => moment.tz(name).utcOffset() === offset * 60);
        const timeZone = timezones[0] || null;

        const currentTime = moment().tz(timeZone);

        const removedGMTLessons = recordset.map((record) => {
          delete record.GMT;
          return record;
        });
        //sortedLessons
        const sortedEvents = removedGMTLessons.sort((a, b) =>
          moment(a.start).diff(moment(b.start))
        );
        //upcomingLesson
        const upcomingSession =
          sortedEvents.find((event) =>
            moment(event.start).isAfter(currentTime)
          ) || {};
        //currentLesson
        const currentSession =
          sortedEvents.find((session) => {
            const startTime = moment(session.start);
            const endTime = moment(session.end);
            return currentTime.isBetween(startTime, endTime);
          }) || {};

        //nextLecturein-what-time
        const timeUntilStart = upcomingSession.id
          ? moment(upcomingSession.start).tz(timeZone).to(currentTime, true)
          : "";

        //is-it in-minutes
        let inMins = false;
        if (
          timeUntilStart.includes("minutes") ||
          timeUntilStart.includes("minute") ||
          timeUntilStart.includes("seconds")
        ) {
          inMins = true;
        }

        res.status(200).send({
          sessions: sortedEvents,
          currentSession,
          upcomingSession,
          inMins,
          upcomingSessionFromNow: timeUntilStart,
        });
      } else {
        res.status(200).send({
          sessions: [],
          currentSession: {},
          upcomingSession: {},
          inMins: false,
          upcomingSessionFromNow: "",
        });
      }
    } catch (err) {
      sendErrors(err, res);
    }
  });
};

module.exports = {
  post_feedback_questions,
  delete_ad_from_shortlist,
  post_student_ad,
  update_student_agreement_to_null,
  put_student_bank_details,
  upload_student_by_field,
  set_code_applied,
  // update_shortlist,
  get_all_students_sessions_formatted,
  post_student_agreement,
  get_feedback_of_questions,
  get_feedback_questions,
  // upload_setup_info,
  get_student_setup,
  // get_student_grade,
  get_published_ads,
  update_student_lesson,
  get_student_lessons,
  post_student_lesson,
  get_tutor_subject,
  // get_student_short_list,
  // upload_student_short_list,
  // get_student_short_list_data,
  get_student_market_data,
  get_tutor_by_subject_faculty,
  get_my_data,
  get_tutor_bookings,
  post_student_setup_at_signup,
  // post_student_bookings,
  // get_student_bookings,
  // get_student_or_tutor_bookings,
  // payment_report,
  // getBookedSlot,
  get_student_bank_details,
  get_student_ads,
  get_shortlist_ads,
  post_student_bank_details,
  get_student_feedback,
  post_student_feedback,
  post_student_invoice_and_lessons,
  delete_student_lesson,
  ad_to_shortlist,
  post_student_setup,
  get_ad,
  get_student_photos,
  put_ad,
  post_student_invoice,
  put_student_invoice,
  update_student_invoice_and_lessons
};
