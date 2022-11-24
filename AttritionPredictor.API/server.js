

//Initiallising node modules
const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");
const https = require("https");
const app = express();
const aws = require("@aws-sdk/client-sagemaker-runtime");

//Setting up server
const server = app.listen(process.env.PORT || 5000, () => {
  const port = server.address().port;
  console.log("Server Address",server.address());
  console.log("App now running on port", port);
});

// Body Parser Middleware
app.use(bodyParser.json());

//CORS Middleware
app.use((req, res, next) => {
  //Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization"
  );
  next();
});

//Initiallising connection string
// const dbConfig = {
//   user: "howathon",
//   password: "Sapient@19",
//   server: "howathon2019.database.windows.net",
//   database: "HOWATHON19_CLOUD",

//   options: {
//     encrypt: true // Use this if you're on Windows Azure
//   }
// };

const dbConfig = {
  user: "sa",
  password: "password",
  server : 'attritiondb.cli4eb85gn5x.ap-southeast-2.rds.amazonaws.com',
  database: "AttritionDB",
  encrypt: true,
};

//Function to connect to database and execute query
const executeQuery = (res, query) => {
  sql.connect(dbConfig, (err) => {
    if (err) {
      console.log("Error while connecting database :- " + err);
      res.send(err);
    } else {
      // create Request object
      const request = new sql.Request();
      // query to the database
      request.query(query, (err, recordSet) => {
        if (err) {
          console.log("Error while querying database :- " + err);
          res.send(err);
        } else {
          res.send(recordSet);
        }
      });
    }
  });
};
const conn = new sql.ConnectionPool(dbConfig);
const executeProcedure = (res, proc) => {
  conn.connect((err) => {
    if (err) {
      console.log("Error while connecting database :- " + err);
      conn.close();
      res.send(err);
    } else {
      // create Request object
      const request = new sql.Request(conn);
      request.execute(proc, (err, recordSet) => {
        if (err) {
          console.log("Error while querying database :- " + err);
          conn.close();
          res.send(err);
        } else {
          conn.close();
          res.send(recordSet);
        }
      });
    }
  });
};

const executeNonQuery = (res, proc, params) => {
  conn.connect((err) => {
    if (err) {
      console.log("Error while connecting database :- " + err);
      conn.close();
      res.send(err);
    } else {
      // create Request object
      const request = new sql.Request(conn);
      if (params) {
        params.forEach((param) => {
          request.input(param.inputParam, param.inputType, param.inputValue);
        });
      }
      request.execute(proc, (err, recordSet) => {
        if (err) {
          console.log("Error while querying database :- " + err);
          conn.close();
          res.send(err);
        } else {
          conn.close();
          res.send(recordSet);
        }
      });
    }
  });
};

// GET API
app.get("/api/getAttitionResult", (req, res) => {
  // const query = "select * from [dbo].[MasterDataSet]";
  // executeQuery(res, query);
  const proc = "dbo.GETDASHBORDDATA";
  executeProcedure(res, proc);
});

app.get("/api/getSegmentResult", (req, res) => {
  // const query = "select * from [dbo].[MasterDataSet]";
  // executeQuery(res, query);
  const proc = "dbo.GETSEGMENTSDATA";
  executeProcedure(res, proc);
});

app.get("/api/getSurveyFactors", (req, res) => {
  // const query = "select * from [dbo].[MasterDataSet]";
  // executeQuery(res, query);
  const proc = "dbo.GETSURVEYFACTORS";
  executeProcedure(res, proc);
});

app.get("/api/getAttitionFactorWithValue", (req, res) => {
  // const query = "select * from [dbo].[MasterDataSet]";
  // executeQuery(res, query);
  const proc = "dbo.GETATTRITIONFACTORSWITHDATA";
  executeProcedure(res, proc);
});

app.get("/api/getMoraleCheckData", (req, res) => {
  // const query = "select * from [dbo].[MasterDataSet]";
  // executeQuery(res, query);
  const proc = "dbo.GETMORALECHECKDATA";
  executeProcedure(res, proc);
});

// POST API
app.post("/api/getRealTimePrediction", (req, res) => {
  const dataString = JSON.stringify(req.body);
  var params = {
    Body:req.body /* Strings will be Base-64 encoded on your behalf */, /* required */
    EndpointName: 'https://runtime.sagemaker.ap-southeast-2.amazonaws.com/endpoints/ShazaamMl-24112022/invocations', /* required */
    Accept: 'application/json',
    ContentType: "application/json",
  };
 
  aws.config.loadFromPath('./config.json');

  const sagemakerruntime = new aws.SageMakerRuntime();

  sagemakerruntime.invokeEndpoint(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);      
  });

  // //const reqPost = https.request(options, callback);
  // // This is the data we are posting
  // reqPost.write(dataString);
  // reqPost.end();

  // reqPost.on("error", (err) => {
  //   console.log("Error while connecting to Azure ML :- " + err);
  //   res.send(err);
  // });
});

// PUT API
app.put("/api/saveSurveyData/:employeeNumber", (req, res) => {
  let inputParam = "EMPLOYEENUMBER";
  let inputType = sql.VarChar(50);
  const params = [
    {
      inputParam: inputParam,
      inputType: inputType,
      inputValue: req.params.employeeNumber,
    },
  ];
  req.body.forEach((p) => {
    if (p[0] === "Comments") {
      inputType = sql.VarChar(500);
    } else if (p[0] === "IsSurveyFilled") {
      inputType = sql.Bit;
    } else {
      inputType = sql.VarChar(50);
    }
    params.push({
      inputParam: p[0],
      inputType: inputType,
      inputValue: p[1],
    });
  });
  const proc = "dbo.UPDATESURVEYFACTORS";
  executeNonQuery(res, proc, params);
});

// // DELETE API
//  app.delete("/api/user /:id", (req , res) => {
//                 const query = "DELETE FROM [user] WHERE Id=" + req.params.id;
//                 executeQuery (res, query);
// });
