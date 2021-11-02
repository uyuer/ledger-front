import React, { useEffect, useRef, useState } from "react";
import classnames from "classnames";
import styles from "./style.module.scss";

// 时间滚动条
export default function ScrollBar(props) {
	let scrollBarRef = useRef();
	let { start, end, unit, initValue, onChange } = props;
	let [value, setValue] = useState(initValue);
	let [childrenHeight, setChildrenHeight] = useState(0);
	let temp = new Array(end - start + 1).fill(0);
	let year = temp.map((item, index) => start + index);

	useEffect(() => {
		if (scrollBarRef.current) {
			let [children] = scrollBarRef.current.children || [];
			setChildrenHeight(children ? children.offsetHeight : 0)
		}
	}, [scrollBarRef]);

	useEffect(() => {
		if (!childrenHeight) {
			return;
		}
		let timer = null;
		let ele = scrollBarRef.current;
		ele.addEventListener("scroll", (e, a) => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				let scrollTop = ele.scrollTop;
				if (scrollTop % childrenHeight != 0) {
					let extra = scrollTop % childrenHeight;
					ele.scrollTop = scrollTop - extra;
				}
			}, 100);
		});
		scrollBarRef.current.scrollTop = Math.abs(value - start - 2) * childrenHeight;
	}, [childrenHeight])

	useEffect(() => {
		if (!initValue) {
			return;
		}
		scroll(initValue)
		setValue(initValue);
	}, [initValue])

	const scroll = (target) => {
		let site = Math.abs(target - start) <= 2 ? 0 : Math.abs(target - start - 2);
		scrollBarRef.current.scrollTop = Math.abs(site) * childrenHeight;
	}

	const itemClick = (v) => {
		scroll(v)
		setValue(v);
		onChange(v)
	}

	return (
		<div className={classnames(styles.scrollBar, styles.scrollYBar)} ref={scrollBarRef}>
			{year.map((item) => {
				return (
					<div key={item} className={classnames({ [styles.avtive]: item === value })} onClick={() => itemClick(item)}>
						{item}
						<span className={styles.unit}>{unit}</span>
					</div>
				);
			})}
		</div>
	);
}

ScrollBar.defaultProps = {};
