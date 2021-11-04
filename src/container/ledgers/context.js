import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { Message } from 'antd';
import { getLocalUserInfo } from 'utils/util';
import service from 'service';
export const CostContext = React.createContext({});

const typeDict = { 'year': '年', 'month': '月', 'all': '全部' }
function formatType(type) {
    return typeDict[type];
}
function formatDateText(current) {
    let { date, type } = current;
    let [year, month] = date ? date.split('-') : [undefined, undefined]
    let dateStrText = {
        'year': `${year}年`,
        'month': `${year}年${month}月`,
        'all': '全部'
    }[type];
    return dateStrText;
}
function formatTime(current) {
    let { date, type } = current;
    let format = 'YYYY-MM-DD HH:mm:ss'
    let end = moment().format('YYYY-MM');
    let tempTime = {
        'year': [moment(date).format(format), moment(date).add(1, 'years').subtract(1, 'seconds').format(format)],
        'month': [moment(date).format(format), moment(date).add(1, 'months').subtract(1, 'seconds').format(format)],
        'all': [moment(1949).format(format), moment(end).subtract(1, 'seconds').format(format)]
    }[type]
    return tempTime;
}
export default (props) => {
    // 查询账本列表, (根据账本详情统计出累计收入和支出)
    // 获取到账本列表之后, 根据时间筛选对应的账单详情, 显示列表和图谱
    const [selectedBooKId, setSelectedBookId] = useState(null);

    const initYear = new Date().getFullYear();
    const initMonth = new Date().getMonth() + 1;
    const [current, setCurrent] = useState({
        date: `${initYear}-${initMonth < 10 ? '0' + initMonth : initMonth}`, // 日期
        type: 'month',  // 当前类型 ['year'.'month','all' ]
    });
    const [type, setType] = useState('') // 当前类型
    const [dateText, setDateText] = useState('') // 当前日期
    const [time, setTime] = useState(null); // 筛选条件时间段 [2021-06-01,2021-06-30]

    useEffect(() => {
        setType(formatType(current.type));
        setDateText(formatDateText(current));
        setTime(formatTime(current));
    }, [current])

    const [detailList, setDetailList] = useState([]);
    const [listLoading, setListLoading] = useState(false);
    // 获取数据
    const getList = useCallback(async () => {
        let [start, end] = time || [];
        setListLoading(true)
        service.detail.findAll({ bookId: selectedBooKId, start, end }).then(data => {
            setDetailList(data)
        }).finally(() => {
            setListLoading(false)
        })
    }, [selectedBooKId, time])

    useEffect(() => {
        if (!selectedBooKId || !time) {
            return;
        }
        getList()
    }, [getList, selectedBooKId, time])

    const [labels, setLabels] = useState([]); // 标签
    function getLabels() {
        const user = getLocalUserInfo() || {};
        const { id: userId } = user || {}
        if (!userId) {
            return Message.error('错误! 未登录用户')
        }
        let params = { userId }
        service.label.findAll(params).then(result => {
            setLabels(result);
        })
    }
    useEffect(() => {
        getLabels()
    }, [])

    const [batchRecordVisible, setBatchRecordVisible] = useState(false);

    // 账单数据(编辑|新增)面板
    const [recordVisible, setRecordVisible] = useState(false);
    const [editType, setEditType] = useState('');
    const [record, setRecord] = useState(null);

    function editRecordHandle(data) {
        setRecordVisible(!recordVisible)
        setEditType('edit')
        setRecord(data)
    }
    function addRecordHandle(data) {
        setRecordVisible(!recordVisible)
        setEditType('add')
        setRecord(null)
    }
    function cancelRecordHandle() {
        setRecordVisible(!recordVisible)
        setEditType('')
        setRecord(null)
    }

    const value = {
        // 公共的fn
        labels, setLabels, // 标签列表
        getLabels, // 获取标签列表

        detailList, setDetailList,
        listLoading, setListLoading, // 账单详情加载状态
        getList, // 获取账单详情列表

        selectedBooKId, setSelectedBookId, // 当前被选中账本

        type, setType, // 当前时间类型
        current, setCurrent, // 当前时间段 对象
        dateText, setDateText, // 当前日期范围字符串
        time, // 当前时间段 数组

        batchRecordVisible, setBatchRecordVisible, // 账单数据批量编辑 显示状态

        recordVisible, setRecordVisible, // 账单数据面板 显示状态
        editType, setEditType, // 账单数据编辑类型
        record, setRecord, // 账单数据编辑|新增初始数据
        editRecordHandle, // 账单数据编辑处理
        addRecordHandle, // 账单数据新增处理
        cancelRecordHandle, // 账单数据编辑|新增面板关闭
    }

    return value;
}