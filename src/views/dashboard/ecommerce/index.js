// ** React Imports
import { useEffect, useState } from 'react'
import axios from "axios";
// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Form,
  Label,
  CardBody,
  CardTitle,
  CardHeader,
  InputGroup,
  InputGroupText
} from 'reactstrap'
// ** Context
import { ThemeColors } from '@src/utility/context/ThemeColors'

// ** Demo Components
import CompanyTable from './CompanyTable'
import Earnings from '@src/views/ui-elements/cards/analytics/Earnings'
import CardMedal from '@src/views/ui-elements/cards/advance/CardMedal'
import CardMeetup from '@src/views/ui-elements/cards/advance/CardMeetup'
import StatsCard from '@src/views/ui-elements/cards/statistics/StatsCard'
import GoalOverview from '@src/views/ui-elements/cards/analytics/GoalOverview'
import RevenueReport from '@src/views/ui-elements/cards/analytics/RevenueReport'
import OrdersBarChart from '@src/views/ui-elements/cards/statistics/OrdersBarChart'
import CardTransactions from '@src/views/ui-elements/cards/advance/CardTransactions'
import ProfitLineChart from '@src/views/ui-elements/cards/statistics/ProfitLineChart'
import CardBrowserStates from '@src/views/ui-elements/cards/advance/CardBrowserState'

// **AntD Components
//General
import Button from '@src/@core/components/input/general/Button'

//Layout
import Title from '@src/@core/components/input/general/Title'
import { Divider } from 'antd'
import Grid from "@src/@core/components/input/layout/Grid"
import Layout from "@src/@core/components/input/layout/Layout"
import { Space } from 'antd'

//Navigation
import Anchor from "@src/@core/components/input/navigation/Anchor"
import Breadcrumb from "@src/@core/components/input/navigation/Breadcrumb"
import Dropdown from "@src/@core/components/input/navigation/Dropdown"
import Menu from "@src/@core/components/input/navigation/Menu"
import Pagination from "@src/@core/components/input/navigation/Pagination"
import Steps from "@src/@core/components/input/navigation/Steps"

//Data Entry
import AutoComplete from "@src/@core/components/input/dataEntry/AutoComplete"
import Cascader from "@src/@core/components/input/dataEntry/Cascader"
import Checkbox from "@src/@core/components/input/dataEntry/Checkbox"
import DatePicker from "@src/@core/components/input/dataEntry/DatePicker"
// import {Form as MyForm} from "@src/@core/components/input/dataEntry/Form"
import { Input } from "@src/@core/components/input"
import InputNumber from "@src/@core/components/input/dataEntry/InputNumber"
import Mentions from "@src/@core/components/input/dataEntry/Mentions"
import Radio from "@src/@core/components/input/dataEntry/Radio"
import Rate from "@src/@core/components/input/dataEntry/Rate"
import { Select } from "@src/@core/components/select"
import Slider from "@src/@core/components/input/dataEntry/Slider"
import Switch from "@src/@core/components/input/dataEntry/Switch"
import TimePicker from "@src/@core/components/input/dataEntry/TimePicker"
import Transfer from "@src/@core/components/input/dataEntry/Transfer"
import TreeSelect from "@src/@core/components/input/dataEntry/TreeSelect"
import Upload from "@src/@core/components/input/dataEntry/Upload"
import Dynamo from "@src/@core/dyno"

// ** Styles
import '@styles/react/libs/charts/apex-charts.scss'
import '@styles/base/pages/dashboard-ecommerce.scss'
import { Bar } from 'react-chartjs-2'
// import mockTest from "./dynoMock.json"
import mockTest from "./dynoMock-old.json"

const sample110 = {
  root: {
    name: "root",
    items: ["body"],
    visible: true,
  },
  whatsYourName: {
    id: "whatsYourName",
    type: "select",
    name: "whatsYourName",
    label: "Whats Your Name buddy? ${wathchMei}",
    options: [
      {
        label: "hi",
        value: "hi"
      },
      {
        label: "wow",
        value: "wow"
      }
    ],
    // label: (props) => (values) => `hi hi from f(x) ;)`,
    value: "",
    // disabled: (props) => (values) => Valid('wathchMei', '==', '90')(values),
    visible: true,
    rule: {
      required: "I dont know your name yet hmmmmm.",
      min: {
        value: null,
        message: "",
      },
      max: {
        value: null,
        message: "",
      },
      minLength: {
        value: 3,
        message: "min 3",
      },
      maxLength: {
        value: 3,
        message: "max 3",
      },
      pattern: {
        value: "",
        message: "",
      },
      validate212121: {
        positiveNumber: "only positive number pls yeah :)",
        lessThanHundred: "cant be less than hundred ;)",
      },
      validateCompse: {
        letsComposeValidation: {
          positiveNumber: "only positive number pls yeah :)",
          lessThanHundred: "cant be less than hundred ;)"
        }
      },
      deps: ["wathchMei"],
      validate2121: {
        positiveNumber: (value) => {
          console.log(value, 'positiveNumber validatevalidatevalidatevalidate')
          const result = parseFloat(value) > 0;
          return result && result || "errororororororororoo"
        },
        lessThanHundred: (value) => {
          console.log(value, 'lessThanHundred validatevalidatevalidatevalidate')
          return parseFloat(value) < 200 || "less than 200"
        },
      },
      validate1234: [
        {
          messages: "",
          validation: "fxPositiveNumber"
        }
      ]
    },
    watch: false
  },
  "body": {
    id: "body",
    type: "fieldset",
    name: "body",
    label: "Welcome to New Year 2023 ;)",
    value: "",
    visible: true,
    templateName: "cardContainer",
    items: ["header", "whatsYourName", "container", "dataSource"],
  },
  "container": {
    id: "container",
    type: "fieldset",
    name: "container",
    label: "Fieldset",
    value: "",
    visible: true,
    items: ["wathchMei", "howAreYouThen", "submitME"],
  },
  submitME: {
    id: "submitME",
    type: "button",
    name: "submitME",
    label: "Button",
    value: "",
    disabled: "fxtriggerBackground()",
    visible: true,
    "action": {
      "name": "default",
      "actionURL": "hi",
      "actionType": "callAPI",
      "schema": {
        "accountId": "whatsYourName",
        "checkbox": "howAreYouThen",
        "startDate": "wathchMei",
        "endDate": "dateSelection.endDate"
      }
    }
  },
  "howAreYouThen": {
    id: "howAreYouThen",
    type: "switch",
    name: "howAreYouThen",
    label: "wathchMei",
    options: [],
    visible: true,
    rule: {
      required: "Transfer select hello From Bank is required.",
      min: {
        value: null,
        message: "",
      },
      max: {
        value: null,
        message: "",
      },
      minLength: {
        value: null,
        message: "",
      },
      maxLength: {
        value: null,
        message: "",
      },
      pattern: {
        value: "",
        message: "",
      },
    },
    preCondition: [

    ]
  },
  "header": {
    id: "header",
    type: "label",
    name: "header",
    label: "Example of Watch & DataSource",
    value: "Value",
    visible: true,
  },
  "dataSource": {
    id: "dataSource",
    type: "dataSource",
    name: "dataSource",
    label: "wathchMei",
    value: "Value",
    visible: true,
    watch: true
  },
  wathchMei: {
    id: "wathchMei",
    type: "text",
    name: "wathchMei",
    label: "watch me ;)",
    value: "",
    valueType: "",
    visible: true,
    disabled: false,
    rule: {
      required: "Transfer From Bank is required.",
      min: {
        value: null,
        message: "",
      },
      max: {
        value: null,
        message: "",
      },
      minLength: {
        value: null,
        message: "",
      },
      maxLength: {
        value: null,
        message: "",
      },
      pattern: {
        value: "",
        message: "",
      },
    },
    watch: true
  },
};

const form = {
  "category": "63b12cb5013c34001c1728a1",
  "contact": "63b12df2013c34001c1728a8"
}

const EcommerceDashboard = () => {

  const [data, updateData] = useState(mockTest)

  const root = 'https://dynamobff.maybanksandbox.com/forms/'

  useEffect(() => {
    console.log(data, 'data ressssssssssss')
    axios.get(`${root}${form['category']}`).then(res => {
      console.log(res, 'ressssssssssss')
      updateData(res.data);
    }).catch(error => {
      console.log(error, 'error ressssssssssss')
    })
  }, [])

  if (!data) return null;

  return (
    <Dynamo
      key={data._id}
      dynoName={data._id}
      dataStore={data.dataHelper}
      defaultValues={data.defaultValues}
      fields={data.items}
      localFunction={{
        "getResource": async ({ url, form, item, data: formData }) => {
          const result = await axios.get(`http://localhost:3033/commerce/resource/${url}`).then(res => {
            console.log(res, 'ressssssssssss updatedddd getResource ;)')
            return res;
            // updateData({...data, dataHelper: {...data.dataHelper, [name]: res.data}});

          }).catch(error => {
            console.log(error, 'error ressssssssssss')
          });
          return result;
        },
        "callAPI": async ({ url, form, item, data: formData }) => {
          console.log('brrrrrrr', formData);
          if (!formData) return;
          const commerce = {
            data: formData,
            user: {
              "isAdmin": true
            },
            type: data.name
          }
          axios.post(`http://localhost:3033/commerce`, commerce).then(res => {
            console.log(res, 'ressssssssssss updatedddd ;)')
            //updateData(res.data);
          }).catch(error => {
            console.log(error, 'error ressssssssssss')
          })
          // if (!formData) return;
          // await form.reset();
        }
      }}
    />
  )

  return (
    <div id='dashboard-ecommerce'>

      <Space direction="vertical">


        <h1>**********[GENERAL]**********</h1>

        <h1>Button</h1>
        <Button />

        <h1>Title</h1>
        <Title />



        <h1>**********[LAYOUT]**********</h1>
        <h1>Divider</h1>
        <Divider />

        <h1>Grid</h1>
        <Grid />

        <h1>Layout</h1>
        <Layout />

        <h1>Space</h1>


        <h1>**********[NAVIGATION]**********</h1>
        <h1>Anchor</h1>
        <Anchor />

        <h1>Breadcrumb</h1>
        <Breadcrumb />

        <h1>Dropdown</h1>
        <Dropdown />

        <h1>Menu</h1>
        <Menu />

        <h1>Pagination</h1>
        <Pagination />

        <h1>Steps</h1>
        <Steps />

        <h1>**********[DATA ENTRY]**********</h1>
        <h1>Auto Complete</h1>
        <AutoComplete />

        <h1>Cascader</h1>
        <Cascader />

        <h1>Checkbox</h1>
        <Checkbox />

        <h1>Date Picker</h1>
        <DatePicker />

        <h1>Form</h1>
        <Form />

        <h1>Input</h1>
        <Input />

        <h1>Input Number</h1>
        <InputNumber />

        <h1>Mentions</h1>
        <Mentions />

        <h1>Radio</h1>
        <Radio />

        <h1>Rate</h1>
        <Rate />

        <h1>Select</h1>
        <Select />

        <h1>Slider</h1>
        <Slider />

        <h1>Switch</h1>
        <Switch />

        <h1>TimePicker</h1>
        <TimePicker />

        <h1>Transfer</h1>
        <Transfer />

        <h1>TreeSelect</h1>
        <TreeSelect />

        <h1>Upload</h1>
        <Upload />




      </Space>
    </div>
  )
}

export default EcommerceDashboard
