import React from "react"
import Head from "next/head";
import Image from "next/image";
import styles from '../styles/Home.module.css'

export default class Home extends React.Component {
	constructor(props){
		super(props)
	}

	async loadData(){

	}

	componentDidMount(){
		this.loadData()
	}

	render(){
		<div className={styles.container}>
			<div className={styles.topNav}> 
				Top Nav	
			</div>
		</div>
	}
}