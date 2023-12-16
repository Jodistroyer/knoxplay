/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react'

// import { json, useParams } from "react-router-dom";
import { useRouter } from 'next/router'
import axios from 'axios'
import {
  FormBuilderV4 as DynamoEngine,
  useHistory,
  actionsRunner, // useDynamoHistory,
  transformer
} from 'dynamo'
import { renderComponent, validationResolver } from 'src/@core/components'
import useDynamoHistory from 'src/@core/utils/useDynamoHistory'
import _ from 'lodash'
import moment from 'moment'
import Lottie from 'lottie-react'
import loaderAnimation from 'src/@core/components/loader.json'

const jsonata = require('jsonata')

function isURL(value) {
  return value?.startsWith('http://') || value?.startsWith('https://') || value?.startsWith('data:image')
}

const headers = {
  'Content-Type': 'application/json',
  'Content-Length': '<calculated when request is sent>',
  Host: '<calculated when request is sent>',
  Accept: '*/*'
}

const DynamoScreen = props => {
  const {
    // url = "https://yasser.com/forms/64f15de0013c34001c1a6648",
    //  url = "https://yasser.com/forms/6518663f013c34001c1c2ca8",
    url = 'https://yasser.com/forms/653781d9013c34001c1e5421'
  } = props

  // const { params } = useParams();

  const router = useRouter()
  const { params } = router.query

  const routingMap = { maeTaskRewards: '6527a4e2013c34001c1d3d10' }
  const pathURL = routingMap[params] ? routingMap[params] : params
  const serverURL = 'https://yasser.com/forms/'
  const formURL = params ? serverURL + pathURL : url

  const [showLoader, setShowLoader] = useState(false)

  const [errorVisible, setErrorVisible] = useState(false)
  const [customErrorVisible, setCustomErrorVisible] = useState(false)

  const dynamoRef = useRef(null)

  const [loading, setLoading] = useState(false)


  // const [currentJson, setCurrentJson] = useState(null);
  const [dataStore, setDataStore] = useState({
    ZeroBase: 900
  })

  const [customErrormessage, setCustomErrormessage] = useState('')

  const {
    current: state,
    currentIndex,
    history,
    goBack: historyGoBack,
    goTo: historyGoTo,
    insertObject: setState,
    updateCurrent,
    getHistory,
    toggleBasket,
    insertBasket,
    getBasket,
    clearBasket,
    makeBasket,
    destroyBasket,
    goTo,
    getCurrentBasket,
    goToEnd,
    goNext
  } = useDynamoHistory([], 'name', 0, true, true)

  const options = {
    animationData: loaderAnimation,
    loop: true
  }

  // jsonata("a + d").evaluate({ a: 43, b: 44 }, {}, (error, result) => {
  //     if (error) {
  //         console.error('[jsonataa]', error);
  //         return;
  //     }
  //     console.log('[jsonataa]', result);
  // }).then(result => {
  //     console.log('[jsonataa]', result);
  // });

  const Loader = () =>
    (showLoader && (
      <div
        style={{
          position: 'absolute',
          padding: 0,
          margin: 0,
          zIndex: 9999,
          top: 0,
          left: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: '#ffffff'
        }}
      >
        <Lottie
          animationData={options.animationData}
          loop={options.loop}
          style={{
            height: '40%',
            width: '40%',
            position: 'relative'
          }}
        />
      </div>
    )) ||
    null

  // useEffect(() => {
  //     const messageListener = (event) => {
  //         try {
  //             const eventData = event?.data || {};
  //             const data =
  //                 typeof eventData === "string" ? JSON.parse(eventData) : eventData;

  //             console.log("messageListener-data:", data, dataStore);

  //             if (data.source === "dynamo") {
  //                 console.log("messageListener-data: [dynamo]", data);
  //                 setDataStore({ ...dataStore, ...data.payload });
  //             }
  //         } catch (err) {
  //             console.error("messageListener-err:", err);
  //         }
  //     };

  //     window?.ReactNativeWebView?.postMessage(
  //         JSON.stringify({ status: "ready" })
  //     );

  //     window.addEventListener("message", messageListener);

  //     return () => {
  //         window.removeEventListener("message", messageListener);
  //     };
  // }, [dataStore]);

  const fetchDynamoJson = url => {
    // setShowLoader(true);
    axios
      .get(url)
      .then(res => {
        // setDataStore(res.data?.dataHelper);
        // setCurrentJson(res.data);
        // setState(res.data);

        let updatedResult = res?.data?.data ?? res.data
        const { dataHelper = {}, dataModel = {}, defaultValues = {} } = updatedResult

        if (dataHelper && dataModel) {
          for (const [key, value] of Object.entries(dataModel)) {
            // need to check $ for binding
            // const dataBindingValue = _.get(dataHelper, `${value.substring(2)}`);
            // updatedResult = _.set(updatedResult, `items.${key}`, dataBindingValue);
            updatedResult = _.set(updatedResult, `items.${key}`, value)
          }
        }

        for (const [key, value] of Object.entries(updatedResult.items)) {
          const itemDefaultValue = _.get(value, 'defaultValue')
          if (itemDefaultValue) {
            _.set(updatedResult, `defaultValues.${value.name}`, itemDefaultValue)
          }
        }
        setDataStore(prev => ({ ...prev, ...updatedResult?.dataHelper }))

        setState(updatedResult)
        setShowLoader(false)
        
return res.data
      })
      .catch(err => setShowLoader(false))
  }

  useEffect(() => {
    fetchDynamoJson(formURL)
  }, [formURL])

  const fetchData = async (url, method, data, optionalHeaders = headers) => {
    setShowLoader(true)

    const apiMethod = method === 'post' ? 'post' : 'get'
    console.log('apiMethod ------> ', apiMethod)
    const payload = _.cloneDeep(data)
    const headerPayloads = _.cloneDeep(optionalHeaders)

    // const example = {
    //   "headers": {
    //     "Authorization": "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXNfa2V5IjoiVTJGc2RHVmtYMS9lWTNkZy9kbW42N3gvd2VYSU83L3VMRHp2NDdwY28yRDQvTjR5OHBsdTgxVklYU3BOU2xVK1FMMkpwNTZ6NHJhbnZZS2lYcS9KWUE9PSIsImF1ZCI6WyJ6dXVsR2F0ZXdheSJdLCJ1c2VyX25hbWUiOiJLSFFSMDciLCJjdXNUeXBlIjoiMDEiLCJzY29wZSI6WyJFRElUX0JBTktJTkciLCJFRElUX05PTl9CQU5LSU5HIiwiUkVBRF9CQU5LSU5HIiwiUkVBRF9OT05fQkFOS0lORyJdLCJtYXlhX3Nlc3Npb25faWQiOiJAQEBAMjAyMzEwMzExOS40NzI0NzQ0NzU2QEBAQCIsIm0ydV91c2VyX2lkIjo0ODMsInBhbiI6IlRBV2tRRERKQ09rb01ma25hd3pUSlR3UE01c29kRWVrZWpYWHZ3bE1HSWw0MlJ4ZEVmY2tvVlA2NnIrd3J0bExrZUsrSjlKM2lyWWJVbUcvWnpIdnVYT3c4RDk4NGRFNy9kZHNOQ2JwalBQZ0VSb1l2ekE4UzJTRmpxeVRaeXYzMFIwNFh2VWtvSXpMQ0hucEtqSGpMVDZQbnJjRFBsNE8rM3BTUVU5RHMybz0iLCJleHAiOjE3MzAyODY2MTgsInVzZXJJZCI6MTU3OTcyOSwianRpIjoiOGQ5ZjE3NDgtNjhkNC00MDIxLTlmYmMtMDBkZGI4NzRkYzFiIiwiY2xpZW50X2lkIjoiTTJVR0FURVdBWSJ9.FnBbkw19PKT9s0pdciVy9TOi771qyaatPcBqSEtAJj0",
    //     "Country": "KH",
    //     "Content-Type": "application/json"
    //   }
    // }

    console.log('headdddders', headerPayloads)

    let axiosArguments = [url]
    if (apiMethod === 'post') {
      axiosArguments.push(payload)
      axiosArguments.push(headerPayloads)
    }
    if (apiMethod === 'get') {
      axiosArguments.push(headerPayloads)
    }

    //axios.get(url, headers)
    //axios.get(url, payload, headers)

    const result = await axios[apiMethod](...axiosArguments)
    console.log(result, '[fetchData then]')
    setShowLoader(false)

    return result.data
  }

  const whatIf = config => dataStore => async item => {
    return new Promise(async (resolve, reject) => {
      const { source, destination, condition } = config

      // console.log(config, dataStore, 'actionzzzz', 'whatIf');

      // console.info('whatIf source', source);
      // console.info('whatIf condition ', condition);
      const allLocalFunction = dynamoRef.current.localFunction

      const input = _.get(item, source)

      // console.info('whatIf input ', input, item);
      try {
        const result = await transformer(input, condition)

        // console.info('whatIf result ', result);
        // console.info('whatIf actionzzzz', input, result, config, dataStore);

        const defaultAction = _.get(config, 'DEFAULT')
        const nextActions = _.get(config, result, defaultAction)

        actionsRunner(nextActions, allLocalFunction, { ...item }, dataStore)
          .then(lastResult => {
            // console.log('managedCallback Last result: whatIf:', lastResult);
            resolve({
              ...item,
              ..._.set(item, destination, {
                ...item.dataStore,
                ...lastResult.dataStore
              })
            })
          })
          .catch(error => {
            error && reject(error?.message || 'error occurred')

            // console.error('managedCallback An error occurred: whatIf:', error);
          })
      } catch (e) {
        reject(new Error('whatIf catch error ', e))
      }
    })
  }

  const transforming = config => dataStore => async item => {
    return new Promise(async (resolve, reject) => {
      const { destination = 'transforming', source, schema } = config
      const input = _.get(item, source)
      try {
        const result = await transformer(input, schema)
        resolve({
          ...item,
          ..._.set(item, destination, result)
        })
      } catch {
        reject('hmmmmmmmmm')
      }
    })
  }

  const addError = config => dataStore => async item => {
    return new Promise(async (resolve, reject) => {
      const { destination = 'transforming', source, schema } = config

      try {
        const errorObject = _.cloneDeep(schema)
        console.log(destination, errorObject, '[errorrrrrrrr]', dynamoRef.current.errors)

        // const formData = await myForm.current.setError('whatsYourName', {message: "wowowowowow"});

        await dynamoRef.current.setError('amount', { message: 'wowowowowow' })
        reject({ name: 'amount', message: 'wowowowowow' })

        // resolve({
        //   ...item
        // })
      } catch (error) {
        // reject(error)
      }
    })
  }

  const triggerVisibility = config => dataStore => async item => {
    return new Promise(async (resolve, reject) => {
      const { destination, value } = config
      setDataStore({ ...dataStore })
      resolve({
        ...item,
        ..._.set(item, 'dataStore.' + destination, value)
      })
    })
  }

  const jumpToEnd = config => dataStore => async item => {
    return new Promise(async (resolve, reject) => {
      console.log('[yasser] jumpToEnd', currentIndex, history.length)

      // goToEnd();
      if (history.length - 1 === currentIndex) {
        resolve()
      } else {
        goToEnd()

        // reject("it is skipped ;)")
      }
    })
  }

  const goToNext = config => dataStore => async item => {
    return new Promise(async (resolve, reject) => {
      console.log('[yasser] goToNext', currentIndex, history.length)

      // goToEnd();
      if (history.length - 1 === currentIndex) {
        resolve()
      } else {
        goNext()
      }
    })
  }

  const navigateTo = config => dataStore => async item => {
    return new Promise(async (resolve, reject) => {
      const { destination = 'navigateTo', actionURL, schema } = config
      if (isURL(actionURL)) {
        // const result = await axios.get(actionURL, false, {});
        const result = await fetchDynamoJson(actionURL)
        resolve({
          ...item,
          ..._.set(item, destination, result)
        })
      }
      reject('it is failed due to url !!!')
    })
  }

  const [error, updateError] = useState({
    error: false,
    message: 'hello it is me ;)'
  })

  const [customError, updateCustomError] = useState({
    error: false,
    message: 'hello it is me ;)'
  })
  const clearError = () => updateError({ status: false, message: '' })

  const callApi = config => dataStore => async item => {
    return new Promise(async (resolve, reject) => {
      const { destination = 'callApi', url, schema, method, optionalHeaders = {} } = config
      if (isURL(url)) {
        try {
          const response = await fetchData(url, method, schema, optionalHeaders)
          console.log('callApi response  ------> ', response)
          if (response?.result || response?.data) {
            updateError({ status: true, message: response.message })
            resolve({
              ...item,
              ..._.set(item, destination, response)
            })
          } else if (response?.error) {
            // await dynamoRef.current.setError('amount', {message: "wowowowowow"});
            setShowLoader(false)
            console.log('#############################in error case')
            updateError({ status: true, message: response.error[0].message })
            setErrorVisible(true)
            reject()
          }
        } catch (error) {
          //TODO: state for visible error should be managed inside component
          // rather than re-render whole page ;)
          setShowLoader(false)
          console.log(error, 'errorrr apiCall')
          updateError({ status: true, message: error?.response?.data?.errors[0]?.message })
          setErrorVisible(true)
        }
      }

      // reject("it is failed due to url !!!");
    })
  }

  const sendPost = config => dataStore => async item => {
    return new Promise(async (resolve, reject) => {
      const message = JSON.stringify(config)
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(message)
      } else {
        window.postMessage(message)
      }
      resolve(item)
    })
  }

  const hideMe = (component, target) => values => {
    const source = values.getValues()
    
return !(source[component] === target)
  }

  const filterMe = (component, array, attribute) => values => {
    const arrayData = values[array]
    const source = values.getValues()
    const target = source[component]?.value ? source[component]?.value : source[component]
    
return source[component] ? arrayData.filter(data => data[attribute] === target) : arrayData

    // : []; // should return empty array if cascade parent is not selected right?
  }

  const filterByType = (component, array, attribute) => values => {
    const arrayData = values[array]
    const source = values.getValues()
    const target = source[component]?.type ? source[component]?.type : source[component]
    
return source[component] ? arrayData.filter(data => data[attribute] === target) : arrayData
  }

  const hideMeByType = (component, target) => values => {
    const source = values.getValues()
    
return source[component]?.type && source[component]?.type === target

    //showing the component other than for useries
  }

  const validateDate = dateField => values => {
    const inputDate = values[dateField]
    const inputDateString = new Date(inputDate)
    const currentDate = new Date()
    
return !(currentDate < inputDateString)
  }

  const validateAge = dateField => values => {
    const birthDateString = values[dateField]
    const today = new Date()
    const birthDate = new Date(birthDateString)
    let age = today.getFullYear() - birthDate.getFullYear()
    let m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age < 18
  }

  const goBack = config => dataStore => async item => {
    return new Promise(async (resolve, reject) => {
      const { jsonName = null } = config
      if (jsonName) {
        historyGoTo(jsonName)
      } else {
        historyGoBack()
      }
      resolve({
        ...item
      })
    })
  }

  const goToIndex = config => dataStore => async item => {
    return new Promise(async (resolve, reject) => {
      const { jsonName, destination = 'goToIndex', userTabIndex } = config
      console.log('historyGoToIndex      =======================>>>>>>>>>>>>>>>>     ', config, dataStore)
      resolve({
        ...item,
        ..._.set(item, destination, userTabIndex)
      })
      historyGoTo(jsonName)
    })
  }

  const goToPage = config => dataStore => async item => {
    return new Promise(async (resolve, reject) => {
      const { page } = config
      console.log('goToPage  -->', config)
      goTo(page)
    })
  }

  const updateDataStore = config => dataStore => async item => {
    return new Promise(async (resolve, reject) => {
      console.log('[updateDataStore]', config, dataStore)
      const { destination, value } = config
      setDataStore({ ...dataStore })
      resolve({
        ...item,
        ..._.set(item, 'dataStore.' + destination, value)
      })
    })
  }

  const printMe = config => dataStore => async item => {
    return new Promise(async (resolve, reject) => {
      console.log('printMe', dataStore)
    })
  }

  const validation = config => dataStore => async item => {
    return new Promise(async (resolve, reject) => {
      const { destination = 'formData' } = config
      const formData = await dynamoRef.current.getValues()
      console.log('actionzzzz', 'validation', formData, config, dataStore)
      if (!formData) {
        reject('it is invalid. !!!')
      }
      resolve({ ...item, [destination]: formData })
    })
  }

  const fetchAPIData = config => dataStore => async item => {
    console.log(`fetchAPIData: ${JSON.stringify(config)} ${JSON.stringify(dataStore)} ${JSON.stringify(item)}`)

    return new Promise(async (resolve, reject) => {
      const { destination = 'fetchData', apiParams, actionAPI } = config

      setShowLoader(true)

      const apiReqObj = services[actionAPI](apiParams) || null
      if (apiReqObj) {
        try {
          const result = await apiReqObj(dataStore?.access_token)
          dataStore[actionAPI] = result?.data
          setDataStore(prevDataStore => ({ ...prevDataStore, ...dataStore }))
          resolve({
            ...item,
            ..._.set(item, destination, result?.data)
          })
        } catch (e) {
          setShowLoader(false)
          reject(e)
        }
      }
    })
  }

  function actionsRunners(action, localFunction, item, dataStore) {
    let resultPromise = Promise.resolve(item)

    for (const index in action) {
      const internalAction = action[index]
      const functionName = Object.keys(internalAction)[0]
      const config = internalAction[functionName]
      const asyncFunction = localFunction[functionName]

      console.log('[yasser] action', action[index], config, asyncFunction)

      resultPromise = resultPromise.then(result => {
        console.log(index, asyncFunction, 'dyno actionsRunner', result)
        
return asyncFunction(config)(dataStore)(result)
      })
    }

    return resultPromise
  }

  const managedCallback = async ({ item, data = null, validate = true }) => {
    console.log('[errorrrrrrrr]', dynamoRef.current.errors)

    const formData = await dynamoRef.current.getValuesBackground(false)
    console.log(formData, '[yasser] formData')
    updateCurrent({
      ...state(),
      defaultValues: { ...formData },
      snapshot: { ...formData }
    })

    if (item && item.action && typeof item.action === 'object') {
      const allLocalFunction = dynamoRef.current.localFunction
      let polyAction = item.action
      if (polyAction.actionURL) {
        const { actionURL, actionType } = item.action
        polyAction = {
          [actionType]: {
            actionURL
          }
        }
      }

      if (item && item.action && !Array.isArray(item.action)) {
        const covert = Object.keys(item.action).map(function (key) {
          return { [key]: item.action[key] }
        })
        polyAction = covert // [...item.action]
      }
      console.log('[yasser] typeof item.action', typeof item.action, item.action, polyAction)

      const result = await actionsRunners(polyAction, allLocalFunction, { 'x-item': item, dataStore }, dataStore)
        .then(lastResult => {
          console.log('managedCallback Lastresult:', lastResult)
          setDataStore({ ...dataStore, ...lastResult?.dataStore })
          console.log('managedCallback Last result:', lastResult?.dataStore)
        })
        .catch(error => {
          error.name && error.message && dynamoRef.current.setError(error.name, { message: error.message })
          console.error('managedCallback An error occurred:', error)
        })

      // console.log("managedCallback Lastresult:", result);
      // setDataStore(result?.dataStore);
      // console.log("managedCallback Last result:", dataStore, result?.dataStore);
    }

    // const formData = await dynamoRef.current.getValues();
    // console.log(formData, 'yassssssssss')
    // // throw Error('ffsdf')
    // if (validate) {
    //     const formData = await dynamoRef.current.getValues();
    //     console.log(formData, 'yassssssssss')
    //     if (formData === false) return false;
    // }

    // // If has action
    // if (item?.action && item?.action?.actionType !== "") {
    //     return localFunction[item.action.actionType]({ item, data, form: dynamoRef.current });
    // }

    return true
  }

  const getDataStore = () => {
    return {
      cache: getHistory(),
      basket: getCurrentBasket(),
      ...dataStore
    }
  }
  console.log('Display getDataStore ------> ', getDataStore())

  const positiveNumber = error => resources => value => {
    console.log(value, 'positiveNumber validatevalidatevalidatevalidate', error, resources)
    const result = parseFloat(value) > 0
    
return (result && result) || error
  }

  const amISame = error => resources => async value => {
    const { message, compareTo, method } = error
    const formData = await resources.getValues(compareTo)

    console.log('amISamelalalalal', value)
    let result = true

    switch (method) {
      case 'greater':
        result = parseFloat(value) > parseFloat(formData)
        break

      default:
        result = parseFloat(value) == parseFloat(formData)
    }

    return result || message
  }

  const validate8orMore = config => resources => async value => {
    const allerrors = resources.errors
    const { regex, input, message } = config

    var regexObject = new RegExp(regex)

    const validate = regexObject.test(input)

    console.log(
      allerrors,
      'validationSomethin',

      // resources,
      input,
      regex,
      validate,
      message
    )

    return validate && validate
  }

  const validateLowercase = config => resources => async value => {
    const allerrors = resources.errors
    const { regex, input, message } = config
    var regexObject = new RegExp(regex)

    const validate = regexObject.test(input)

    console.log(
      allerrors,
      'validationLOWERCASE4444',

      // resources,
      input,
      regex,
      validate
    )

    return validate && validate
  }

  const validateEverything = config => resources => value => {
    console.log('DEBUG0_VALIDATEEVERYTHING', config)

    const allerrors = resources.errors
    const { patterns, allInputs } = config

    // const { patterns } = regex;
    // const { allInputs } = input;
    // var regexObject = new RegExp(regex);
    console.log('DEBUG1_VALIDATEEVERYTHING')
    validate8orMore(RegExp(patterns && patterns[0].regex), allInputs && allInputs[0].input)
    validateLowercase(RegExp(patterns && patterns[1].regex), allInputs && allInputs[1].input)

    // const validate = regexObject.test(input);
    console.log('DEBUG2_VALIDATEEVERYTHING')

    console.log(

      // allerrors,
      'validateEverythingDEBUG'

      // resources,
      // input,
      // regex,
      // validate
    )

    return
  }

  const validatePassword = (resources, type) => value => {
    const allerrors = value?.sharedItems.errors
    const elementValue = value[`${resources}`]
    console.log(
      resources,
      elementValue,
      allerrors,
      elementValue && !(allerrors && allerrors[`${resources}`]),
      'DEBUG VALIDATE PASSWORD',
      allerrors && allerrors[`${resources}`] && allerrors[`${resources}`].type,
      'DEBUG VALIDATE PASSWORD2'
    )

    return (elementValue && !(allerrors && allerrors[`${resources}`])) || false
  }

  const validatePasswordLowercase = resources => value => {
    const allerrors = value?.sharedItems.errors
    const elementValue = value[`${resources}`]

    console.log(
      resources,
      elementValue,
      allerrors,
      elementValue && !(allerrors && allerrors[`${resources}`]),
      'DEBUG VALIDATE PASSWORD',
      allerrors && allerrors[`${resources}`] && allerrors[`${resources}`].type,
      'DEBUG VALIDATE PASSWORD2'
    )

    return (
      (elementValue && !(allerrors && allerrors[`${resources}`])) ||
      (elementValue &&
        allerrors &&
        allerrors[`${resources}`] &&
        allerrors[`${resources}`].type === 'validateLowercase') ||
      false
    )
  }

  const dataTransformer = (data, name, obj) => local => {
    const { getValues, dataStore, index = 1 } = local.sharedItems || { getValues: undefined }

    const values = {
      ...dataStore,
      ...((getValues && getValues()) || {}),
      index,
      displayIndex: index + 1,
      ...local
    }

    if (typeof data === 'string') {
      //Happy birthday ;)
      // $$
      // fx
      // {{ amount && Valid() }}
      const ExpRE = /^\s*\{\{([\s\S]*)\}\}\s*$/
      const matched = data.match(ExpRE)

      if (Array.isArray(matched)) {
        // const result = eval(`local.${matched[1]}`);

        // console.info(eval(Array.isArray([])), 'rrrrttttyuuuyi4567898765uyugjhgbmn----', eval(values.username == 777));
        // console.info(matched && matched[1], eval(values.username == 777+`values.username == 7177`), '717yasser');

        // const function name(root){

        // }

        // try {
        // console.info("yassssssssssssssser", result, 'me getValues()()()')
        return new Function('root', `return root.${matched[1]}`)({
          ...values,
          local
        })

        // return result;
        // } catch (error) {
        //     console.log(error, 'errrrryassssser');
        //     return data;
        // }
      }

      //End fo Happy moment of birthday ;)

      if (data !== undefined && data.includes('$$')) {
        console.log('dyno ;) [2]', 'blaherebla', data, dataStore, _.get(values, data.substring(2), ''))

        return _.get(values, data.substring(2), '')
      }

      // check fx first
      if (data !== undefined && data.includes('fx')) {
        // console.log("dyno ;)", data.slice(2), 'sliceeeeeee')
        // try {
        // const result = eval(data.slice(2));
        // const result = eval(`local.${data.slice(2)}`);

        const result = new Function('root', `return root.${data.slice(2)}`)({
          ...values,
          local
        })

        // console.info("yassssssssssssssserFXXXXXXXXXX", result, 'me getValues()()()')
        // return result;

        if (typeof result === 'function') {
          // console.log('dyno ;)', result, 'rrrrrrrsulttttttttt function');
          return result(values)
        }
        if (result?.then) {
          // console.log('dyno ;)', result, 'rrrrrrrsulttttttttt function.then');
          return result.then(function (response) {
            // console.log('dyno ;)', response, 'rrrrrrrsulttttttttt [2] function.then result');
            return response
          })
        }

        // console.log('dyno ;)', result, 'rrrrrrrsulttttttttt [3] function.then lol');
        return result

        // } catch (error) {
        //     console.log("dyno ;)", name, '----->', error, 'rrrrrrrsulttttttttt errorororrororor')
        // }
      }

      let patternResult = data

      // "hi dxTransform()"
      // no {{ 'hi ' && Transform()}}
      if (data !== undefined && data.includes('dx')) {
        patternResult = patternResult.replace(/dx.*?\(.*?\)/g, (_, name) => {
          try {
            // console.log('dyno ;)', _, name, 'pattern waaaaaalalala 2nd', patternResult);
            const result = eval(`local.${_}`)
            if (typeof result === 'function') {
              return result(values)
            }
            
return result
          } catch (error) {
            // console.log('dyno ;)', error, 'dxxxxxxxxxxxxdxdxxdxdxx');
            return _
          }
        })
      }

      patternResult = patternResult.replace(/\$\{(.*?)\}/g, (w, name) => {
        const result = _.get(values, name) || '' //_.get(values, name); values[name]
        console.log(name, values, 'gettttttttt')

        // console.log("dyno ;)", values, 'valuesssssssssssssssssRGEX')
        // console.log("dyno ;)", name, '------>>>>>>------', result, 'pattern waaaaaalalala only', patternResult)

        return result !== undefined && result //"";//field[name];
      })

      return patternResult
    }

    return data
  }

  const isMatchRegex = (prefix, suffix) => values => {
    console.log(suffix, prefix, values, values[suffix], 'RESSSSSSSS')
    var regexObject2 = new RegExp(prefix)
    if (!values[suffix]) {
      return false
    }

    let res = regexObject2.test(values[suffix])
    console.log('RESSSSSSSS', res)

    return res && res
  }

  const isMathMultiRegex =

    // (lowercase, uppercase, integer, special, input) => (values) => {
    (regexList, input) => values => {
      let result = true

      // console.log(suffix, prefix, values, values[suffix], "RESSSSSSSS");
      // var regexObject1 = new RegExp(lowercase);
      // var regexObject2 = new RegExp(uppercase);
      // var regexObject3 = new RegExp(integer);
      // var regexObject4 = new RegExp(special);
      console.log('MUKUTREGEX', values, input, regexList.length)
      for (let i = 0; i < regexList.length; i++) {
        var regexObject = new RegExp(regexList[i])

        if (!regexObject.test(values[input])) {
          result = false
        }

        console.log(
          'regexList[i]',
          regexList[i],
          'result ',
          result,
          ' actual result ',
          regexObject.test(values[input]),
          ' input - ',
          values[input]
        )
      }

      return result

      // if (!values[input]) {
      //   return false;
      // }

      // let res =
      //   // regexObject1.test(values[input]) ||
      //   // regexObject2.test(values[input]) ||
      //   // regexObject3.test(values[input]) ||
      //   // regexObject4.test(values[input]) ||
      //   // false;
      // console.log("MULTIREGEX", res);

      // return res && res;
    }

  const isUsernameSame = (userName, input) => values => {
    if (!values[input]) {
      return false
    }
    const source = values.getValues()

    const name = 'louis'
    const securityPhrase = 'cat'

    let res = name === source[input] ? false : true
    console.log(input, userName, values, values[input], res, 'usernameCheck')

    return res && res
  }

  const compareInput = (input1, input2) => values => {
    if (!values[input1]) {
      return false
    }
    const source = values.getValues()
    let res = source[input1] === source[input2] ? true : false
    console.log(source[input1], source[input2], res, 'compareinputcheck')

    return res && res
  }

  const validateSameName = error => resources => async value => {
    const { message = ' ', input } = error
    const formData = await resources.getValues()

    const name = 'louis'
    const securityPhrase = 'cat'
    let bbb = value.includes(name)
    let ccc = value.includes(securityPhrase)

    let result = bbb !== true && ccc !== true
    console.log('DIXON WAS HERE', ccc, bbb, result)
    console.log('resourcessssss', error, value, name, result, formData)

    return (result && result) || message
  }

  const validateCompareInput = error => resources => async value => {
    const { message = ' ', input } = error

    let result = input === value

    return (result && result) || message
  }

  const checkValueOnRadioBox = input => values => {
    const res = values[input] === 'yes' ? false : true
    
return res && res
  }

  const validateMaxLengthInput = error => resources => async value => {
    const { message = ' ', input } = error
    let validate = false
    if (value !== undefined) {
      const res = value.replace(/ /g, ' ')
      validate = res.length < 3 || res.length > 15 || res.length === 0 ? false : true
    }
    
return (validate && validate) || message
  }

  const maskingRule = (text, data, start, end) => values => {
    let inputString = values.basket[data]
    let input = inputString?.length ? inputString : _.get(values, data)
    if (input) {
      //let maskedNumberWithSpaces = input.replace(input.substring(start,end), "****");
      let maskedNumberWithSpaces = input.substring(0, start) + '****' + input.substring(end)
      let result = text?.length ? text + maskedNumberWithSpaces : maskedNumberWithSpaces
      console.log('Masked result -----> ', result)
      
return result
    }
  }

  const maskData = (str, len) => {
    let maskedData = str.replace(/([a-zA-Z0-9\._@`'‘’,-/\s])/g, '*')

    maskedData = str.substring(0, len) + maskedData.substring(len, str.length)

    return maskedData
  }

  const maskEmail = (data, defaultValue) => values => {
    let inputString = _.get(values, data)

    if (inputString) {
      if (inputString.includes('*')) return inputString

      const userName = inputString.split('@')

      const maskedEmail = `${maskData(userName[0], userName[0].length > 7 ? 2 : 1)}@${userName[1]}`

      return maskedEmail
    } else {
      return defaultValue
    }
  }

  const defaultData = (key1, key2) => values => {
    try {
      const value1 = _.get(values, key1) !== undefined ? _.get(values, key1) : true
      const value2 = _.get(values, key2) !== undefined ? _.get(values, key2) : true

      const selectedObject = {
        [key1]: value1,
        [key2]: value2
      }
      const result = Object.keys(selectedObject).filter(e => selectedObject[e] === true)
      
return result
    } catch (errro) {
      return 'Error !!!'
    }
  }

  const getGroupCheckboxValues =
    (a, seperator = ',') =>
    values => {
      try {
        const object = _.get(values, a)

        // const newMap = new Map(object)
        const joinedString = (object && Array.from(object?.values()).join(seperator)) || ''

        // console.log(_.get(values, a), 'displayyyyyy', joinedString)
        return joinedString
      } catch (errro) {
        return 'Error !!!'
      }
    }

  const checkIfEmpty = (data, defaultValue) => values => {
    const inputValue = values.basket[data]
    const result = inputValue ? inputValue : defaultValue
    
return result
  }

  const prefilledSelect = (data, list) => values => {
    const inputList = _.get(values, list)
    const inputString = _.get(values, data)
    const defaultlist = inputList.find(item => item.label === inputString)
    
return defaultlist
  }

  const displayButton = () => {
    return showLoader ? false : true
  }

  const prefilledCard = (data, list, key) => values => {
    const inputList = _.get(values, list)
    const inputString = values.basket[data]
    let optionsList = []
    inputList && inputList.length === undefined ? optionsList.push(inputList) : (optionsList = inputList)
    let result = ''
    if (inputString === undefined) {
      const filteredArray = optionsList.filter(element => {
        return element.primary === true
      })
      filteredArray.forEach(obj => {
        if (key === 'description') {
          result = obj['prefix'] + ' ' + obj[key]
        } else if (key === 'prefix') {
          result = obj[key] === 'USD' ? obj[key] + ' ' + '100.00' : obj[key] + ' ' + '400,000.00'
        } else {
          result = obj[key]
        }
      })
    } else {
      inputString.forEach(obj => {
        if (key === 'description') {
          result = obj['prefix'] + ' ' + obj[key]
        } else if (key === 'prefix') {
          result = obj[key] === 'USD' ? obj[key] + ' ' + '100.00' : obj[key] + ' ' + '400,000.00'
        } else {
          result = obj[key]
        }
      })
    }
    
return result
  }

  const showCurrencyValidationError = (data, key1, key2) => values => {
    const currencySelected = _.get(values, data)
    const KHRSelected = _.get(values, key1)
    const USDSelected = _.get(values, key2)
    setCustomErrorVisible(false)
    if (KHRSelected !== undefined && USDSelected !== undefined) {
      if (currencySelected.length > 1) {
        setCustomErrorVisible(true)
        setCustomErrormessage('Sorry, please choose only one iSave account currency to proceed.')
      } else if (KHRSelected === true && currencySelected.includes('KHR') !== true && currencySelected.length >= 0) {
        setCustomErrorVisible(true)
        setCustomErrormessage('Sorry, you already have an existing iSave account in this currency.')
      } else if (USDSelected === true && currencySelected.includes('USD') !== true && currencySelected.length >= 0) {
        setCustomErrorVisible(true)
        setCustomErrormessage('Sorry, you already have an existing iSave account in this currency.')
      }
    } else {
      return false
    }
  }

  const updateModelState = config => dataStore => async item => {}

  const callApiForCreateTask = config => dataStore => async item => {
    return new Promise(async (resolve, reject) => {
      const { destination = 'callApiForCreateTask ==============================>', url, schema, method } = config
      if (isURL(url)) {
        console.log('actionUrl ', url, method, schema)
        const dateTimeString = moment(`${schema.taskDueDate} ${schema.taskTimeDue}`).utc().format()

        let updatedSchema = {
          assignor_pan: schema.assignor_pan,
          assignee_phone_number: schema.assignee_phone_number,
          task_name: schema.taskName,
          task_description: schema.taskName,
          task_expiry_date: dateTimeString,
          task_start_date: moment().utc().format(),
          self_assigned: schema.relationship === 'Self'
        }

        if (typeof schema.reminderSwitch === 'boolean' && schema.reminderSwitch) {
          updatedSchema.reminder = schema.reminderSwitch
          updatedSchema.reminder_timer = moment(dateTimeString).subtract(schema.reminderBefore, 'm').utc().format()
        } else {
          updatedSchema.reminder = false
        }

        switch (schema.reward) {
          case 1:
            updatedSchema.reward_type_name = 'MONETARY'
            updatedSchema.reward_amount = schema.rewardAmount
            break

          case 2:
            updatedSchema.reward_type_name = 'FOOD & BEVERAGES'
            break

          case 3:
            updatedSchema.reward_type_name = 'OTHERS'
            updatedSchema.reward_others_name = schema.otherReward
            break

          default:
            break
        }

        const result = await fetchData(url, method, updatedSchema)

        resolve({
          ...item,
          ..._.set(item, destination, result)
        })
      }
      reject('it is failed due to url !!!')
    })
  }

  const localFunction = {
    fetchAPIData: fetchAPIData,
    transformer: transforming,
    navigateTo,
    goBack,
    jumpToEnd,
    goToPage,
    goToIndex,
    positiveNumber,
    amISame,
    printMe,
    validation,
    callApi,
    validate8orMore,
    validateLowercase,
    validatePassword,
    validatePasswordLowercase,
    validateEverything,
    isMatchRegex,
    isMathMultiRegex,
    isUsernameSame,
    compareInput,
    validateSameName,
    validateCompareInput,
    hideMe,
    filterMe,
    filterByType,
    hideMeByType,
    validateDate,
    validateAge,
    checkValueOnRadioBox,
    validateMaxLengthInput,
    sendPost,
    triggerVisibility,
    maskingRule,
    getGroupCheckboxValues,
    checkIfEmpty,
    defaultData,
    updateModelState,
    maskEmail,
    prefilledSelect,
    whatIf,
    addError,
    goToNext,
    displayButton,
    prefilledCard,
    updateDataStore,
    callApiForCreateTask,
    showCurrencyValidationError
  }

  console.log(getDataStore(), '[dataStore] history')

  return (
    <div>
      <Loader />
      <DynamoEngine
        ref={dynamoRef}
        key={`dynamo-${state()?._id}`}
        name={`dynamo-${state()?._id}`}
        items={state()?.items}
        defaultValues={state()?.defaultValues ?? {}}
        defaultValues89={{
          amount: '$$lol',
          city: {
            label: 'Tehran',
            value: 'tehran'
          },
          pay: true,
          marketing: [
            'Yes',
            'No'

            // {value: 'Yes', label: 'Yes Pls spam me ;)'},
            // { value: 'No', label: 'how dare you are ;)' }
          ]
        }}
        components={renderComponent}
        managedCallback={managedCallback}
        localFunction={localFunction}
        validationResolver={validationResolver}
        dataTransformer={dataTransformer}
        dataStore={{
          ...dataStore,
          ...getDataStore()
        }}
        devMode={true}
      />
    </div>
  )
}

export default DynamoScreen

//
// {
//   "addError": {
//     "destination": "amount",
//     "schema": {
//       "message": "i am errorrrrr ;)"
//     }
//   },
//   "callApi": {
//     "url": "http://www.gotonowhere.com",
//     "optionalHeaders": {
//       "headers": {
//         "Authorization": "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXNfa2V5IjoiVTJGc2RHVmtYMS9lWTNkZy9kbW42N3gvd2VYSU83L3VMRHp2NDdwY28yRDQvTjR5OHBsdTgxVklYU3BOU2xVK1FMMkpwNTZ6NHJhbnZZS2lYcS9KWUE9PSIsImF1ZCI6WyJ6dXVsR2F0ZXdheSJdLCJ1c2VyX25hbWUiOiJLSFFSMDciLCJjdXNUeXBlIjoiMDEiLCJzY29wZSI6WyJFRElUX0JBTktJTkciLCJFRElUX05PTl9CQU5LSU5HIiwiUkVBRF9CQU5LSU5HIiwiUkVBRF9OT05fQkFOS0lORyJdLCJtYXlhX3Nlc3Npb25faWQiOiJAQEBAMjAyMzEwMzExOS40NzI0NzQ0NzU2QEBAQCIsIm0ydV91c2VyX2lkIjo0ODMsInBhbiI6IlRBV2tRRERKQ09rb01ma25hd3pUSlR3UE01c29kRWVrZWpYWHZ3bE1HSWw0MlJ4ZEVmY2tvVlA2NnIrd3J0bExrZUsrSjlKM2lyWWJVbUcvWnpIdnVYT3c4RDk4NGRFNy9kZHNOQ2JwalBQZ0VSb1l2ekE4UzJTRmpxeVRaeXYzMFIwNFh2VWtvSXpMQ0hucEtqSGpMVDZQbnJjRFBsNE8rM3BTUVU5RHMybz0iLCJleHAiOjE3MzAyODY2MTgsInVzZXJJZCI6MTU3OTcyOSwianRpIjoiOGQ5ZjE3NDgtNjhkNC00MDIxLTlmYmMtMDBkZGI4NzRkYzFiIiwiY2xpZW50X2lkIjoiTTJVR0FURVdBWSJ9.FnBbkw19PKT9s0pdciVy9TOi771qyaatPcBqSEtAJj0",
//         "Country": "KH",
//         "Content-Type": "application/json"
//       }
//     }
//   }
// }
