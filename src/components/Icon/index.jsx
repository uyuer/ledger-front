import React from 'react';

const icons = {
    餐饮: "icon-canyin",
    交通: "icon-jiaotong",
    住房: "icon-housing",
    美容: "icon-meirong",
    服饰: "icon-clothes",
    运动: "icon-yundong",
    旅行: "icon-lvxing",
    娱乐: "icon-fun",
    生活: "icon-shenghuo",
    医疗: "icon-yiliao",
    通讯: "icon-tongxun",
    学习: "icon-xuexi",
    礼物: "icon-liwu",
    母婴: "icon-muying",
    数码: "icon-shuma",
    零食: "icon-naicha",
    购物: "icon-gouwu",
    水果: "icon-shuiguo",
    其他: "icon-qita",
    default: "icon-qita",
    工资: "icon-gongzi",
    批量添加: "icon-piliangtianjia",
    编辑: "icon-bianji",
    新增: "icon-new01",
};
// icon图片
export default function Icon(props) {
    let icon = icons[props.name] || icons.default;
    return (
        <svg className="icon" aria-hidden="true">
            <use xlinkHref={`#${icon}`}></use>
        </svg>
    )
}