import React from "react"
import Head from "next/head";
import Image from "next/image";
import styles from '../styles/Home.module.css'

export default class Home extends React.Component {
	constructor(props){
		super(props)

		this.state = {
			authenticated: false
		}

		this.authUser = this.authUser.bind(this)
	}

	async authUser(){
		this.setState({
			authenticated: true
		})
	}

	async logOut(){
		this.setState({
			authenticated: false
		})
	}

	componentDidMount(){
	}

	render(){
		return(
			<div className={styles.container}>
				{
					this.state.authenticated 
					?	<div className={styles.topNav}> 
							<div 
								className={styles.profile}
								onClick={this.logOut}
							>

							</div>
						</div>
					:   <div className={styles.authContainer}>
							<div className={styles.usersList}>
								Users
							</div>
							<div className={styles.authForm}>
								<div className={styles.loginForm}>
									<input 
										className={styles.loginInput} 
										type="email"
									/>
									<input 
										className={styles.loginInput} 
										type="password"
									/>
									<div className={styles.loginButton}>
										Log in
									</div>
									<div  className={styles.forgotPassword} > 
										Forgetten password ? 
									</div>
								</div>
								<div>
									<div 
										className={styles.createAccount}
										onClick={this.authUser}
									> 
										Create new account 
									</div>
								</div>
							</div>
						</div>
				}
			</div>
		)
		
	}
}