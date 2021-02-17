const express = require('express');
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express")
const https = require('https');
const axios = require('axios');
const { Console } = require('console');
const app = express();

const swaggerOption = {
    swaggerDefinition: {
        info: {
            title: 'Exchange Rate API',
            version: '1.0.0'
        }
    },
    apis: ['index.js'],
};
const swaggerDocs = swaggerJsDoc(swaggerOption);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

/**
 * @swagger
 * paths:
 *   /average: 
 *     get:
 *          summary: get average exchange rate
 *          parameters:
 *              - in: query
 *                name: from
 *                schema:
 *                  type: integer
 *                required: true
 *                description: starting date
 *              - in: query
 *                name: to
 *                schema:
 *                  type: integer
 *                required: true
 *                description: ending date
 *              - in: query
 *                name: symbol
 *                schema:
 *                  type: string
 *                required: true
 *                description: symbol    
 *          responses:
 *            '200':
 *              description: Success
 */

app.get('/average', (req, res)=>{

    //Params
    let from= req.query.from;
    let to= req.query.to;
    let symbol= req.query.symbol.toUpperCase().split(',').toString();

    /*
    https.get(`https://api.exchangeratesapi.io/history?start_at=${from}&end_at=${to}&symbols=${currency}`, res => {
        let data= "";

        res.on("data", chunk =>{
            data += chunk
        });

        res.on("end", ()=>{
            let list = []
            let finaldata = JSON.parse(data)
            console.log(finaldata.rates)
            //let i=0; i < Object.keys(finaldata.rates).length; i++
            for(let keys in finaldata.rates){
                list.push(finaldata.rates[keys])
            }
            console.log(list) // how do i get this data 
        })
    }).on("error", err =>{
        console.log({"error": err.message})
    })
    */

    //getData() makes request to api
    async function getData() {
    try {

      const response = await axios(`https://api.exchangeratesapi.io/history?start_at=${from}&end_at=${to}&symbols=${symbol}`)
      // storing object in rates
      let rates = response.data.rates;

      let rateList = {};
      let avarage = {}
        //iterating over object and pushing into array rateList
        for(let keys in rates){   
        Object.keys(rates[keys]).forEach((name , index)=>{
            if(rateList[name]){
            
            rateList[name]["avg"]  = (rateList[name]["avg"] + Object.values(rates[keys])[index] )/2
            rateList[name]["sum"]  += Object.values(rates[keys])[index]

            }
            else{
            let obj = {}
            obj.name = name;
            obj.sum =  Object.values(rates[keys])[index];
            obj.avg = Object.values(rates[keys])[index];
            rateList[name] = obj
            }
        }) 
        }
        rateList = Object.values(rateList)
        console.log(rateList);
            console.log(rateList);
        
        res.json(rateList)

    }catch (error) {
        console.error(error.message);
    }
  }
  getData()
})


app.listen(3000, ()=>console.log('server up and runing'))