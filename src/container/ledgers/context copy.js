import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Modal, Message, Table } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { getLocalUserInfo } from 'utils/util';
import service from 'service';
const { confirm } = Modal;
export const CostContext = React.createContext({});

let format = 'YYYY-MM-DD HH:mm:ss'

export default (props) => {
    // 查询账本列表, (根据账本详情统计出累计收入和支出)
    // 获取到账本列表之后, 根据时间筛选对应的账单详情, 显示列表和图谱
    const [selectedBooKId, setSelectedBookId] = useState(null);

    const initYear = new Date().getFullYear();
    const initMonth = new Date().getMonth() - 1;
    const [date, setDate] = useState(`${initYear}-${initMonth < 10 ? '0' + initMonth : initMonth}`); // 日期
    // const [date, setDate] = useState(`${initYear}`); // 日期
    const [dateText, setDateText] = useState('') // 当前日期
    const [type, setType] = useState('月'); // 当前类型 ['年'.'月','至今' ]
    const [time, setTime] = useState(); // 筛选条件时间段 [2021-06-01,2021-06-30]
    useEffect(() => {
        console.log(date)
        let [year, month] = date ? date.split('-') : [undefined, undefined]
        let dateStrText = {
            '年': `${year}年`,
            '月': `${year}年${month}月`,
            '至今': '全部'
        }[type];
        let end = moment().format('YYYY-MM');
        let tempTime = {
            '年': [moment(date).format(format), moment(date).add(1, 'years').subtract(1, 'seconds').format(format)],
            '月': [moment(date).format(format), moment(date).add(1, 'months').subtract(1, 'seconds').format(format)],
            '至今': [moment(1949).format(format), moment(end).subtract(1, 'seconds').format(format)]
        }[type]
        setDateText(dateStrText);
        setTime(tempTime);
    }, [date])

    const [detailList, setDetailList] = useState([]);
    const [statisticsList, setStatisticsList] = useState([]);

    // 获取数据
    async function getList() {
        let [start, end] = time || [];
        service.ledgerDetail.findAll({ bookId: selectedBooKId, start, end }).then(data => {
            let result = data.reduce((total, currentValue) => {
                let { date } = currentValue;
                let formatDate = moment(date).format('YYYY-MM-DD');
                let value = { ...currentValue, date: formatDate }
                if (!total[formatDate]) {
                    total[formatDate] = [value]
                } else {
                    total[formatDate] = [...total[formatDate], value]
                }
                return total;
            }, {})
            let temp = Object.keys(result).map(key => {
                let list = result[key];
                let statistics = list.reduce((total, currentValue) => {
                    switch (currentValue.type) {
                        case '0': total.expend += currentValue.amount; break;
                        case '1': total.income += currentValue.amount; break;
                    }
                    return total;
                }, { date: key, expend: 0, income: 0 })
                return {
                    ...statistics,
                    list
                }
            })
            setDetailList(data)
            setStatisticsList(temp)
        })
    }
    useEffect(() => {
        if (!selectedBooKId || !time) {
            return;
        }
        getList()
    }, [selectedBooKId, time])

    const [visible, setVisible] = useState(false);

    const value = {
        selectedBooKId, setSelectedBookId,
        initYear, initMonth,
        date, setDate,
        dateText, setDateText,
        type, setType,
        time, setTime,
        detailList, setDetailList,
        statisticsList, setStatisticsList,
        visible, setVisible,
    }

    return value;
}