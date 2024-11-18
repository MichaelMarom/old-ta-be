const { marom_db } = require("../db");
const {
  insert,
  update,
  parameteriedUpdateQuery,
  parameterizedInsertQuery,
  findByAnyIdColumn,
} = require("../utils/crud_queries");
const { shortId } = require("../modules");
const sql = require("mssql");
const pkg = require('@clerk/clerk-sdk-node');
const clerkClient = pkg.default;
const { sendErrors } = require('../utils/handleReqErrors');
const SMS_MMS_Temp = require("../schema/admin/SMS_MMS_Temp");

let get_tutor_data = (req, res) => {
  marom_db(async (config) => {
    const sql = require("mssql");
    const { status } = req.query;
    let poolConnection = await sql.connect(config);
    // console.log(poolConnection._connected)
    if (poolConnection) {
      poolConnection
        .request()
        .query(
          `SELECT 
          TS.Status, 
          TS.StatusReason,
          TS.GMT, 
          TS.Photo, 
          TS.FirstName, 
          TS.LastName, 
          TS.CellPhone, 
          TS.AcademyId,
          TS.TutorScreenname, 
          US.email as Email

          From TutorSetup TS
          
          left join Users1 US on US.SID = TS.userId
          where TS.Status='${status}'
          order by TS.CreatedAT desc
          `
        )
        .then((result) => {
          res.status(200).send(result.recordset);
        })
        .catch((err) => console.log(err));
    }
  });
};

let get_role_count_by_status = (req, res) => {
  marom_db(async (config) => {
    const { role } = req.params
    let poolConnection = await sql.connect(config);

    if (poolConnection) {
      poolConnection
        .request()
        .query(
          `
          SELECT count(*) as count, cast(Status as varchar) as Status
              From ${role === 'student' ? 'StudentSetup1' : 'TutorSetup'} as TS
             group by cast(Status as varchar) `
        )
        .then((result) => {
          res.status(200).send(result.recordset);
        })
        .catch((err) => sendErrors(err, res));
    }
  });
};

const get_users_list = async (req, res) => {
  try {
    const response = await clerkClient.users.getUserList();

    console.log(response);
    res.status(200).send(response)
  }

  catch (err) {
    sendErrors(err, res);
  }
}

let set_tutor_status = (req, res) => {
  let { Id, Status } = req.body;
  marom_db(async (config) => {
    let poolConnection = await sql.connect(config);
    // console.log(poolConnection._connected)
    if (poolConnection) {
      poolConnection
        .request()
        .query(
          `
                    UPDATE TutorSetup SET Status = '${Status}' WHERE CONVERT(VARCHAR, AcademyId) = '${Id}'
                `
        )
        .then((result) => {
          result.rowsAffected[0] === 1
            ? res.status(200).send({
              bool: true,
              mssg: "Tutor status was updated successfully",
            })
            : res.status(200).send({
              bool: false,
              mssg: "Tutor status was not updated successfully please try",
            });

          //result.recordset.map(item => item.AcademyId === user_id ? item : null)
        })
        .catch((err) =>
          res
            .status(200)
            .send({ bool: false, mssg: "Database Error, Please Try Again..." })
        );
    }
  });
};

let get_student_data = (req, res) => {
  marom_db(async (config) => {
    const { status } = req.query

    let poolConnection = await sql.connect(config);
    if (poolConnection) {
      poolConnection
        .request()
        .query(
          `SELECT 
          SS.Photo,
          SS.FirstName, 
          SS.LastName, 
          SS.Cell, 
          SS.AcademyId, 
          SS.Status,
          SS.ScreenName,
          SS.GMT,
          U.email,
          SS.StatusReason
          From StudentSetup1 as SS
          join Users1 as U on SS.userId = U.SID
            where cast(Status as varchar) = '${status}' `
        )
        .then((result) => {
          res.status(200).send(result.recordset);
        })
        .catch((err) => sendErrors(err, res));
    }
  });
};

let set_student_status = (req, res) => {
  let { Id, Status } = req.body;
  marom_db(async (config) => {
    const sql = require("mssql");

    let poolConnection = await sql.connect(config);
    if (poolConnection) {
      poolConnection
        .request()
        .query(
          ` UPDATE StudentSetup1 SET Status = '${Status}'
           WHERE CONVERT(VARCHAR, AcademyId) = '${Id}'
                `
        )
        .then((result) => {
          result.rowsAffected[0] === 1
            ? res.status(200).send({
              bool: true,
              mssg: "Student status was updated successfully",
            })
            : res.status(200).send({
              bool: false,
              mssg: "Tutor status was not updated successfully please try",
            });
        })
        .catch((err) =>
          sendErrors(err, res)
        );
    }
  });
};

let get_tutor_new_subject = async (req, res) => {
  marom_db(async (config) => {
    try {
      const poolConnection = await sql.connect(config);

      if (poolConnection) {
        const result = await poolConnection.request().query(
          `SELECT * From NewSubjectReq as ts 
            join TutorSetup as t on t.AcademyId = CAST(ts.AcademyId as varchar(max))
            order by ts.date desc
            `
        );
        res.status(200).send(result.recordset);
      }
    } catch (err) {
      sendErrors(err, res)
    }
  });
};

const get_new_sub_count = async (req, res) => {
  marom_db(async (config) => {
    try {
      const poolConnection = await sql.connect(config);

      if (poolConnection) {
        const result = await poolConnection.request().query(
          `SELECT count(*) as count From NewSubjectReq`
        );
        res.status(200).send(result.recordset);
      }
    } catch (err) {
      sendErrors(err, res)
    }
  });
}

let accept_new_subject = async (req, res) => {
  let { id, subject, AcademyId } = req.body;
  marom_db(async (config) => {
    try {
      const poolConnection = await sql.connect(config);
      if (poolConnection) {
        const query = `INSERT INTO Subjects (FacultyId, SubjectName, CreatedOn) 
                   VALUES ('${id}', '${subject}', GETUTCDATE())`;

        const insert = await poolConnection.request().query(query);

        if (insert.rowsAffected[0]) {
          poolConnection
            .request()
            .query(
              ` DELETE FROM NewSubjectReq WHERE CONVERT(VARCHAR, subject)
                     = '${subject}' AND CONVERT(VARCHAR, AcademyId) = '${AcademyId}' `
            )
            .then((result) => {
              result.rowsAffected[0] === 1
                ? res.status(200).send({
                  bool: true,
                  mssg: "Data was uploaded successfully",
                })
                : res.status(200).send({
                  bool: false,
                  mssg: "Database Error, Please Try Again...",
                });
            })
            .catch((err) => console.log(err));
        }
      }
    } catch (err) {
      sendErrors(err, res)
    }
  });
};

let decline_new_subject = (req, res) => {
  marom_db(async (config) => {
    try {
      let { subject, AcademyId } = req.body;
      const poolConnection = await sql.connect(config);

      const result = poolConnection.request()
        .query(`Update NewSubjectReq set IsRejected = 1 
            WHERE CONVERT(VARCHAR, subject) = '${subject}' AND CONVERT(VARCHAR, AcademyId) = '${AcademyId}' `);

      res.status(200).send({ message: "Subject Declined succesfully" });
    } catch (err) {
      sendErrors(err, res)
    }
  });
};

const postTerms = async (req, res) => {
  await marom_db(async (config) => {
    const poolConnection = await sql.connect(config);
    try {
      const existingRecord = await poolConnection
        .request()
        .query(findByAnyIdColumn("Constants", { ID: req.body.id || 1 }));

      if (existingRecord.recordset.length) {
        if (poolConnection) {
          const request = poolConnection.request();

          request.input("ID", sql.Int, req.body.id || 1);
          request.input(
            "TermContent",
            sql.NVarChar(sql.MAX),
            req.body.TermContent
          );
          request.input(
            "IntroContent",
            sql.NVarChar(sql.MAX),
            req.body.IntroContent
          );
          delete req.body.id;

          const result = await request.query(
            parameteriedUpdateQuery("Constants", req.body, {
              ID: req.body.id || 1,
            }).query
          );

          res.status(200).json(result.recordset[0]);
        }
      } else {
        if (poolConnection) {
          const request = poolConnection.request();

          delete req.body.id;
          request.input(
            "TermContent",
            sql.NVarChar(sql.MAX),
            req.body.TermContent
          );
          request.input(
            "IntroContent",
            sql.NVarChar(sql.MAX),
            req.body.IntroContent
          );

          await request.query(
            parameterizedInsertQuery("Constants", req.body).query
          );

          res
            .status(200)
            .json({ success: true, message: "Terms stored successfully." });
        }
      }
    } catch (error) {
      console.error("Error storing terms:", error.message);
      sendErrors(err, res)
    }
  });
};

let get_Constants = (req, res) => {
  marom_db(async (config) => {
    const sql = require("mssql");

    let poolConnection = await sql.connect(config);
    if (poolConnection) {
      poolConnection
        .request()
        .query(
          `SELECT * From Constants where ID = ${req.params.id}     `
        )
        .then((result) => {
          res.status(200).send(result.recordset);
        })
        .catch((err) => console.log(err));
    }
  });
};

const api_save_email_template = async (req, res) => {
  marom_db(async (config) => {
    try {
      let poolConnection = await sql.connect(config);
      if (poolConnection) {
        const { recordset } = await poolConnection
          .request()
          .query(
            insert('EmailTemplates', req.body)
          )
        res.status(200).send(recordset);
      }
    }
    catch (err) {
      sendErrors(err, res)
    }
  });
}

const api_update_email_template = async (req, res) => {
  marom_db(async (config) => {
    try {
      let poolConnection = await sql.connect(config);
      if (poolConnection) {
        const { recordset } = await poolConnection
          .request()
          .query(
            update('EmailTemplates', req.body, { id: req.params.id })
          )
        res.status(200).send(recordset);
      }
    }
    catch (err) {
      sendErrors(err, res)
    }
  });
}

const api_delete_email_template = async (req, res) => {
  marom_db(async (config) => {
    try {
      let poolConnection = await sql.connect(config);
      if (poolConnection) {
        const { rowsAffected } = await poolConnection
          .request()
          .query(
            ` delete from EmailTemplates where id = '${req.params.id}' `
          )
        res.status(200).send({ deleted: rowsAffected[0] });
      }
    }
    catch (err) {
      sendErrors(err, res)
    }
  });
}

const api_get_email_template = async (req, res) => {
  marom_db(async (config) => {
    try {
      let poolConnection = await sql.connect(config);
      if (poolConnection) {
        const { recordset } = await poolConnection
          .request()
          .query(
            ` SELECT * From EmailTemplates where id = '${req.params.id}'  `
          )
        res.status(200).send(recordset[0]);
      }
    }
    catch (err) {
      sendErrors(err, res)
    }
  });
}

const api_get_email_templates = async (req, res) => {
  marom_db(async (config) => {
    try {
      let poolConnection = await sql.connect(config);
      if (poolConnection) {
        const { recordset } = await poolConnection
          .request()
          .query(
            ` SELECT * From EmailTemplates `
          )
        res.status(200).send(recordset);
      }
    }
    catch (err) {
      sendErrors(err, res)
    }
  });
}



const api_save_sms_mms_temp = async (req, res) => {
  marom_db(async (config) => {
    try {
      let poolConnection = await sql.connect(config);
      if (poolConnection) {
        const request = poolConnection.request();

        Object.keys(req.body).map(key => {
          request.input(key, SMS_MMS_Temp[key], req.body[key]);
        })
        const { recordset } = request
          .query(
            parameterizedInsertQuery('SMS_MMS_Temps', req.body).query
          )
        res.status(200).send(recordset);
      }
    }
    catch (err) {
      sendErrors(err, res)
    }
  });
}

const api_update_sms_mms_temp = async (req, res) => {
  marom_db(async (config) => {
    try {
      let poolConnection = await sql.connect(config);
      if (poolConnection) {
        const request = poolConnection.request();

        Object.keys({ ...req.body, ...req.params }).map(key => {
          request.input(key, SMS_MMS_Temp[key], { ...req.body, ...req.params }[key]);
        })
        const { recordset } = request
          .query(
            parameteriedUpdateQuery('SMS_MMS_Temps', req.body, { id: req.params.id }, {}, false).query
          )
        res.status(200).send(recordset);
      }
    }
    catch (err) {
      sendErrors(err, res)
    }
  });
}

const api_get_sms_mms_temp = async (req, res) => {
  marom_db(async (config) => {
    try {
      let poolConnection = await sql.connect(config);
      if (poolConnection) {
        const { recordset } = await poolConnection
          .request()
          .query(
            ` SELECT * From SMS_MMS_Temps where id = '${req.params.id}'  `
          )
        res.status(200).send(recordset[0]);
      }
    }
    catch (err) {
      sendErrors(err, res)
    }
  });
}

const api_get_sms_mms_temps = async (req, res) => {
  marom_db(async (config) => {
    try {
      let poolConnection = await sql.connect(config);
      if (poolConnection) {
        const { recordset } = await poolConnection
          .request()
          .query(
            ` SELECT * From SMS_MMS_Temps `
          )
        res.status(200).send(recordset);
      }
    }
    catch (err) {
      sendErrors(err, res)
    }
  });
}

module.exports = {
  api_save_sms_mms_temp,
  api_update_sms_mms_temp,
  api_get_sms_mms_temp,
  api_get_sms_mms_temps,
  api_delete_email_template,
  postTerms,
  get_Constants,
  get_tutor_data,
  get_users_list,
  api_save_email_template,
  api_update_email_template,
  api_get_email_template,
  api_get_email_templates,
  get_student_data,
  set_tutor_status,
  get_new_sub_count,
  set_student_status,
  get_tutor_new_subject,
  accept_new_subject,
  decline_new_subject,
  get_role_count_by_status
};
