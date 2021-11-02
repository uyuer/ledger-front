import React, { useState, useEffect, useContext } from 'react';
import { Drawer } from 'antd';


/**
 * 初始化了Drawer的大小, 并设置了初始样式
 *
 * @export
 * @param {*} props
 * @return {*} 
 */
export default function DefineDrawer(props) {
    const [width, setWidth] = useState();
    useEffect(() => {
        let size = '';
        let clientWidth = document.body.clientWidth
        switch (true) {
            case (clientWidth > 1024): size = 'large'; break;
            case clientWidth > 768: size = 'middle'; break;
            default: size = 'small';
        }
        let dict = {
            'large': '50%',
            'middle': '75%',
            'small': '100%',
        }
        setWidth(dict[size])
    }, [])
    return (
        <Drawer
            width={width}
            bodyStyle={{ padding: 10 }}
            placement={'right'}
            destroyOnClose={true}
            {...props}
        >
            {props.children}
        </Drawer>
    )
}