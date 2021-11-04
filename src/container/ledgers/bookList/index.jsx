import React, { useEffect, useState, useContext, useCallback } from "react";
import classnames from "classnames";
import styles from "./style.module.scss";

import Section from "components/Section";
import NoData from "components/NoData";
import bookLabel from "images/bookLabel.png";

import service from "service";
import { CostContext } from "./../context";
// 年支出统计
export default function BookList(props) {
	const { selectedBooKId, setSelectedBookId } = useContext(CostContext);
	const initStatistics = { expend: 0, income: 0 };
	const [statistics, setStatistics] = useState(initStatistics); // 所有账本统计信息
	const [bookList, setBookList] = useState([]); // 账本
	// 获取数据
	const getList = useCallback(async () => {
		service.book.findAll().then((data) => {
			let stati = data.reduce((total, current) => {
				total.expend += current.expend;
				total.income += current.income;
				return total;
			}, statistics);
			setStatistics(stati);
			setBookList(data);
			setSelectedBookId(data[0] ? data[0].id : null);
		});
	}, [statistics, setStatistics, setBookList, setSelectedBookId])
	useEffect(() => {
		getList();
	}, [getList]);

	return (
		<div className={styles.wrapper}>
			<div className={styles.statisticsBox}>
				<div className={styles.statisticsTotal}>
					<p>累计收入</p>
					<p>{statistics.income.toFixed(2)}</p>
				</div>
				<div className={styles.statisticsTotal}>
					<p>累计支出</p>
					<p>{statistics.expend.toFixed(2)}</p>
				</div>
			</div>
			<div className={styles.list}>
				<Section title={"个人账本"} className={styles.sectionContainer} loading={false} >
					<div className={classnames(styles.bookList, styles.scrollYBar)}>
						{bookList && bookList.length ? bookList.map((item) => {
							return (
								<div
									key={item.id}
									className={classnames(styles.bookItem, { [styles.avtive]: selectedBooKId === item.id })}
									onClick={() => {
										setSelectedBookId(item.id);
									}}
								>
									<div className={styles.cover}>
										<div className={styles.bookLabel}>
											<img src={bookLabel} alt="" />
										</div>
										<div className={styles.bookName}>{item.name}</div>
										<div className={styles.edit}></div>
									</div>
									<div className={styles.bookInfo}>
										<p>收入: {item.income.toFixed(2)}</p>
										<p>支出: {item.expend.toFixed(3)}</p>
									</div>
								</div>
							);
						}) : <NoData />}
					</div>
				</Section>
			</div>
			{/* <div className={styles.operation}>
				<div className={styles.icon}>
					<span title={"下载"}>
						<DownloadOutlined />
					</span>
					<span className={styles.addIcon} title={"导入"}>
						<CloudUploadOutlined />
					</span>
					<span title={'批量添加'} onClick={batchAddHandle}>
						<Icon name="批量添加" />
					</span>
				</div>
			</div> */}
		</div>
	);
}

BookList.defaultProps = {};
