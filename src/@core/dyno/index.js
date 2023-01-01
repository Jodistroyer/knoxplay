import { useState, useRef, useEffect } from "react";

import _ from "lodash";
import { FormBuilderV4 as DynoBuilder } from "dynamo";

//Data Entry
import AutoComplete from "@src/@core/components/input/dataEntry/AutoComplete"
import Cascader from "@src/@core/components/input/dataEntry/Cascader"
import { Checkbox } from "@src/@core/components/checkbox"
import DatePicker from "@src/@core/components/input/dataEntry/DatePicker"
// import {Form as MyForm} from "@src/@core/components/input/dataEntry/Form"
import { Input } from "@src/@core/components/input"
import InputNumber from "@src/@core/components/input/dataEntry/InputNumber"
import Mentions from "@src/@core/components/input/dataEntry/Mentions"
import { Radio } from "@src/@core/components/radio"
import Rate from "@src/@core/components/input/dataEntry/Rate"
import { Select } from "@src/@core/components/select"
import Slider from "@src/@core/components/input/dataEntry/Slider"
import { Switch } from "@src/@core/components/switch"
import TimePicker from "@src/@core/components/input/dataEntry/TimePicker"
import Transfer from "@src/@core/components/input/dataEntry/Transfer"
import TreeSelect from "@src/@core/components/input/dataEntry/TreeSelect"
import Upload from "@src/@core/components/input/dataEntry/Upload"
import { Button } from '@src/@core/components/button'
import { Title } from '@src/@core/components/label'
import { Container } from '@src/@core/components/container'
import { Error } from '@src/@core/components/error'

const DynamoField = ({ dataStore, fields, devTest, width = "90%", localFunction = {}, defaultValues, dynoName }) => {
    const [data, setData] = useState();
    const [items, setItems] = useState(fields);

    const myForm = useRef({});

    const extraFunctions = localFunction;

    useEffect(() => {
        myForm.current.reset();
    }, [defaultValues]);

    // useEffect(() => {

    // }, []);

    // <div className="inputContainer">{children}</div>

    const renderContainer = (children) => <div sm='12' className='mb-1'>
        {children} </div>

    const renderContainerDefault = (children) => children

    const validationResolver = {
        noteq: async (item, value) => {
            return (value !== "" && !item.value.includes(value)) || false;
        },
        eq: async (item, value) => {
            return value?.toString() === item.value;
        },
        notEmptyAndEqual: async (item, value) => {
            return (value !== "" && item.value.includes(value)) || false;
        },
        hasValue: async (item, value) => {
            return value !== "" || false;
        }
    };

    const newComponents = {
        "text": (props) => <Input {...props} />,
        "select": (props) => <Select {...props} />,
        "fieldset": (props) => <Container {...props} />,
        "button": (props) => <Button {...props} />,
        "checkbox": (props) => <Checkbox {...props} />,
        "radiobox": (props) => <Radio {...props} />,
        "switch": (props) => <Switch {...props} />,
        "label": (props) => <Title {...props} />,
    };

    //   const itemsRefs = useRef({});

    //   const updateItemsRefs = (data) => {
    //     itemsRefs.current = data;
    //     console.log(itemsRefs.current, "itemsRefs.current");
    //     return { ...data };
    //   };

    const renderComponent = (type, propsItems) => {
        console.log("PROPSITems", propsItems);
        const { item } = propsItems;
        if (!item) return null;

        const selectedComponent = newComponents && newComponents[type];
        if (selectedComponent === undefined) return null;

        return renderContainer(selectedComponent({ ...propsItems, Error }));
        // return selectedComponent({ ...propsItems })
    };

    //START PROXY
    //TEST Proxy
    const dataTransformerTest = (data, name, obj) => (local) => {
        const { getValues } = obj.sharedItems;
        const values = getValues();
        console.log(data, values, 'getValues()()()')

        if (typeof data === 'function') {
            return data()(values)
        }

        if (typeof data === "string") {
            // check fx first
            if (data !== undefined && data.includes("$$")) {
                console.log("blaherebla", data, dataStore)
                return _.get(dataStore, data.substring(2));
            }

            if (data !== undefined && data.includes("fx")) {
                console.log(data.slice(2), 'sliceeeeeee')
                try {
                    // const result = eval(data.slice(2));
                    const result = eval(`local.${data.slice(2)}`);

                    console.log(result, 'rrrrrrrsulttttttttt')
                    if (typeof result === 'function') {
                        return result(values);
                    }
                    return result;
                } catch (error) {
                    console.log(error, 'rrrrrrrsulttttttttt errorororrororor')
                }
            };

            let patternResult = data;

            if (data !== undefined && data.includes("dx")) {
                patternResult = patternResult.replace(/dx.*?\(.*?\)/g, (_, name) => {

                    try {
                        console.log(_, name, 'pattern waaaaaalalala 2nd', patternResult)
                        const result = eval(`local.${_}`);
                        if (typeof result === 'function') {
                            return result(values);
                        }
                        return result;
                    } catch (error) {
                        console.log(error, 'dxxxxxxxxxxxxdxdxxdxdxx')
                        return _;
                    }
                });
            }

            patternResult = patternResult.replace(/\$\{(.*?)\}/g, (_, name) => {

                const result = values[name] || ''; //_.get(values, name);
                console.log(values, 'valuesssssssssssssssssRGEX')
                console.log(name, '------>>>>>>------', result, 'pattern waaaaaalalala only', patternResult)

                return result !== undefined && result//"";//field[name];
            });

            return patternResult;

        };

        return data;
    }

    //Test Proxy
    //POC PROXY
    const dataTransformation = (data, name, obj) => (local) => {
        const values = { ...obj.sharedItems };
        if (data === undefined || data === null) return data;

        if (typeof data === "string") {
            // check fx first
            if (data !== undefined && data.includes("fx")) {
                try {
                    // const result = eval(data.slice(2));
                    const result = eval(`extraFunctions.${data.slice(2)}`);
                    if (typeof result === "function") {
                        return result(values);
                    }
                    return result;
                } catch (error) {
                    console.log(error, "rrrrrrrsulttttttttt errorororrororor");
                }
            }

            if (data !== "") {
                const result = _.get(values, data) ?? data; // values[data] || data;
                // if(result!== undefined) return result;
                return result;
            }
        }

        return data;
    };

    // POC PROXY
    const proxyHandler = {
        get(target, prop, receiver) {
            if (typeof target[prop] === "object" && target[prop] !== null) {
                console.log(target[prop], "proxyHanlerrrrrrrr ;)");
                return new Proxy(target[prop], proxyHandler);
            } else {
                return dataTransformation(
                    target[prop],
                    prop,
                    target
                )({
                    ...extraFunctions
                });
            }
        }
    };

    // END PROXY
    const flattenHelper = (currentObject, newObject, previousKeyName) => {
        for (let key in currentObject) {
            let value = currentObject[key];

            if (value?.constructor !== Object) {
                if (previousKeyName == null || previousKeyName == "") {
                    newObject[key] = value;
                } else {
                    if (key == null || key == "") {
                        newObject[previousKeyName] = value;
                    } else {
                        newObject[previousKeyName + "." + key] = value;
                    }
                }
            } else {
                if (previousKeyName == null || previousKeyName == "") {
                    flattenHelper(value, newObject, key);
                } else {
                    flattenHelper(value, newObject, previousKeyName + "." + key);
                }
            }
        }
    };

    const flattenObject = (oldObject) => {
        const newObject = {};

        flattenHelper(oldObject, newObject, "");

        return newObject;
    };

    const managedCallback = async ({ item, actionType = "partial" }) => {
        if (item?.action?.actionType !== "") {
            const formData = await myForm.current.getValues();

            // const copy = _.cloneDeep(item.action.schema);
            //POC Proxy
            const proxyItems = new Proxy(
                {
                    ...flattenObject({
                        ...item?.action?.schema
                    }),
                    sharedItems: { ...formData, ...item }
                },
                proxyHandler
            );
            console.log("onlyFromData", formData);

            let newSchema = {};
            const y = Object.keys(proxyItems).map((el) => {
                if (el === "sharedItems") return;
                newSchema = _.set(newSchema, el, proxyItems[el]);
                console.log(el, "flattttttttten");
            });

            const cloneDeepSchema = _.cloneDeep(newSchema);

            console.log(
                newSchema,
                "7777777",
                _.clone(newSchema, true),
                "----------",
                item,
                item.action,
                formData,
                myForm?.current,
                // item.action,
                "hibyela"
            );

            //OLD approach ;)
            // extraFunctions[item.action.actionType](
            //   item.action.actionURL,
            //   formData,
            //   myForm?.current,
            //   item.action,
            // )

            const result = await extraFunctions[item?.action?.actionType]({
                url: item?.action?.actionURL,
                data: formData,
                form: myForm?.current,
                item: {
                    ...(_.isEmpty(cloneDeepSchema) ? item : cloneDeepSchema)
                }
            })
                .then((response) => {
                    // const formDataAfter = myForm.current.getValues();

                    console.log("instance response lol inside", response);

                    // item.items = response.root?.items;

                    // let newItems = response;
                    // delete newItems.root;

                    // let oio = {
                    //   root: items.root,
                    //   ...itemsRefs?.current,
                    //   [item.id]: item,
                    //   ...newItems,
                    // }

                    // setItems(
                    //   updateItemsRefs(oio)
                    // );
                    // setItems(response.items);

                    return response;
                })
                .catch((error) => {
                    console.log("instance error lol", error);
                });
                return result;
        }

        // // Get dynamo form values
        // const formData = await myForm.current.getValues();

        // // false means error is there
        // // otherwise the data object returns
        // if (!formData) return null;

        // // just sample store data in component
        // setData(formData);

        // console.log("this is result from dynamo ;)", formData);
        return true;
    };

    console.log("renderrrrrrrr", items, dataStore);

    return (
        <>
            <div style={{ minWidth: width }}>
                {items && (
                    <DynoBuilder
                        key={dynoName}
                        devMode={false}
                        ref={myForm}
                        items={items}
                        dataStore={{ ...dataStore }}
                        defaultValues={{ ...defaultValues }}
                        localFunction={localFunction}
                        components={renderComponent}
                        managedCallback={managedCallback}
                        // dataTransformer={dataTransformerTest}
                        validationResolver={validationResolver}
                    />
                )}
            </div>
            {devTest && (
                <div className="field" style={{ padding: "2rem", marginTop: "2rem" }}>
                    <b>Result ;)</b>
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
            )}
        </>
    );
};

export default DynamoField;
