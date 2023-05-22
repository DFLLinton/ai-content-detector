import React, { useState} from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { CircularProgressbar } from 'react-circular-progressbar';
//import ReactFormInputValidation from "react-form-input-validation";
import 'react-circular-progressbar/dist/styles.css';
import './css/custom.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './css/custom.css'

// import { easeQuadInOut } from "d3-ease";
// import AnimatedProgressProvider from "./AnimatedProgressProvider.js";
const validationSchema = Yup.object().shape({
  textAreaField: Yup.string().required('This field is required.')
    .test('len', 'Must be 1000 characters or More', (val) => 
      val ? val.length >= 1000 : true),
});
function Home() {
  const [inputText, setInputText] = useState();
  const [aiPercentage, setAiPercentage] = useState(0);
  const [humanPercentage, setHumanPercentage] = useState(0);
  const [classification, setClassification] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
   
  const handleMessageChange = (e) =>{
      const data = e.target.value;
      setInputText(data);
  }
  const handleSubmit = async (e) => { 
      setInputText(e.textAreaField);
      fetchData();
  }
  async function fetchData()
  {
    setIsLoading(true);
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
        'Authorization': 'Bearer sess-1vRGUNY2L9KMl0HqhqZvAbUJsW7yTv9OIrumtc6M',
        'Connection': 'keep-alive',
        'Content-Type': 'application/json',
        'Origin': 'https://platform.openai.com',
        'Referer': 'https://platform.openai.com/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
        'sec-ch-ua': '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
      },
      body: JSON.stringify({
        'prompt': inputText + "».\n<|disc_score|>",
        'max_tokens': 1,
        'temperature': 1,
        'top_p': 1,
        'n': 1,
        'logprobs': 5,
        'stop': '\n',
        'stream': false,
        'model': 'model-detect-v2',
      })
    });
    if (response.status == 200) {
    
      const responseJson = await response.json();
      const choices = responseJson.choices[0];
      const logprobs = choices.logprobs.top_logprobs[0];  
      const probs = {};
      for (const [key, value] of Object.entries(logprobs)) {
        probs[key] = 100 * Math.exp(value);            
      }
       console.log(probs);
      const possibleClasses = ['very unlikely', 'unlikely', 'unclear if it is', 'possibly', 'likely'];
      const classMax = [10, 45, 90, 98, 99];
      var keyProb = probs['"'];
    
      let classLabel = '';
      if (classMax[0] < keyProb && keyProb < classMax[classMax.length - 1]) {
        const val = Math.max(...classMax.filter(i => i < keyProb));
        classLabel = possibleClasses[classMax.indexOf(val) + 1];
      } else if (keyProb < classMax[0]) {
        classLabel = possibleClasses[0];
      } else {
        classLabel = possibleClasses[possibleClasses.length - 1];
      }
   
      const humanPercentage = Math.round(100 - keyProb);
      const aiPercentage = Math.round(keyProb);
      setAiPercentage(aiPercentage);
      setHumanPercentage(humanPercentage);
      const topProb = { Class: classLabel };
      setClassification(topProb);
      setIsLoading(false);
      setShowResult(true); 
    
    }
  }
 
  return (
    <div className='full mb-5 mt-4 w-75 m-auto min_height'>
      <>
        <h2 className='my-3 text-center'>Content Detector</h2>
        <div className='row d-flex align-items-center justify-content-between'>
          <div className='col-2'>
            <div style={{ height: 300 }}>
              <h3 className='text-center'>AI </h3>
              
              <CircularProgressbar value={aiPercentage} text={aiPercentage + "%"} strokeWidth={8} styles={{
                path: {
                  stroke: 'blue',
                  transition: 'stroke-dashoffset 0.5s ease 0s'
                }
              }} />
            </div>
          </div>
          <div className='col-8'>
            <Formik
              initialValues={{ textAreaField: '', }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}>
              {({ errors, touched }) => (
                <Form >
                  <div className=''>
                    <div className="form-group">
                      <Field name="textAreaField" as="textarea" rows="12" className="w-100" onKeyUp={handleMessageChange} placeholder="Paste you content here...." ></Field>
                      {errors.textAreaField && touched.textAreaField && (
                       <p className='error'> <ErrorMessage name="textAreaField"/></p>
                      )}
                    </div>
                    <div className='mt-2'>
                      {isLoading ? (<Button variant="primary"  className='btn btn-dark hover-overlay'> Loading ...</Button>
                      ) : (<Button variant="primary" className='btn btn-dark hover-overlay' type="submit">Detect</Button>
                      )}
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
          <div className='col-2'>
            <div style={{ height: 300 }}>
              <h3 className='text-center'>Human</h3>
              <CircularProgressbar value={humanPercentage} text={humanPercentage + "%"} strokeWidth={8} styles={{
                path: {
                  stroke: 'green'
                }
              }} />
            </div>
          </div>
        </div>
      </>
      <div>
        {showResult ? <div className='p-2 rounded text-light mt-5 m-auto text-center bg-primary w-50'>
          {classification && (
            <p className='m-0' style={{ fontSize:'12px'}}>The text is classified as: {classification.Class}</p>
          )}
        </div> : ''}
      </div>
    </div>
  );
}

export default Home;
