import React from "react"
import Head from "next/head";
import Image from "next/image";
import styles from '../styles/Home.module.css'

import { initializeApp } from "firebase/app";
import { 
	TwitterAuthProvider, 
	GithubAuthProvider, 
	getAuth, 
	onAuthStateChanged,
	signInWithPopup,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword, 
	updateProfile,
	signOut
} from "firebase/auth";


import { getFirestore, collection, getDocs } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAiFHqtPYiH5IsCCUNHYBwiwyUFA_bqrQ4",
  authDomain: "railbnb.firebaseapp.com",
  projectId: "railbnb",
  storageBucket: "railbnb.firebasestorage.app",
  messagingSenderId: "1039689999605",
  appId: "1:1039689999605:web:c3e4f247a7fb8af613d1bc",
  measurementId: "G-WLBHVJHGW9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export default class Home extends React.Component {
	constructor(props){
		super(props)

		this.state = {
			logoutPanel: false,
			authenticated: false,
			creatingUser: false, 
			firstName: '',
			lastName: '',
			email: '',
			password:'',
			confirm_password: '',
			activeUserName: '',
			activeUserEmail: '',
			activeUserPhoto: ''
		}

		this.createUser = this.createUser.bind(this)
		this.startLogin = this.startLogin.bind(this)
		this.setSignupFirstname = this.setSignupFirstname.bind(this)
		this.setSignupLastname = this.setSignupLastname.bind(this)

		this.setSignupEmail = this.setSignupEmail.bind(this)
		this.setSignupPassword = this.setSignupPassword.bind(this)
		this.setSignupConfirmPassword = this.setSignupConfirmPassword.bind(this)
		this.signupNewUser = this.signupNewUser.bind(this)

		this.setLoginEmail = this.setLoginEmail.bind(this)
		this.setLoginPassword = this.setLoginPassword.bind(this)
		this.loginUser = this.loginUser.bind(this)


		this.showLogout = this.showLogout.bind(this)
		this.logOut = this.logOut.bind(this)
	}

	async createUser(){
		this.setState({
			creatingUser: true
		})
	}

	async startLogin(){
		this.setState({
			creatingUser: false
		})
	}

	async setSignupFirstname(event){
		this.setState({
			firstName: event.target.value
		})
	}

	async setSignupLastname(event){
		this.setState({
			lastName: event.target.value
		})
	}

	async setSignupEmail(event){
		this.setState({
			email: event.target.value
		})
	}

	async setSignupPassword(event){
		this.setState({
			password: event.target.value
		})
	}

	async setSignupConfirmPassword(event){
		this.setState({
			confirm_password: event.target.value
		})
	}

	async signupNewUser(){
		let email = this.state.email
		let password = this.state.password
		let confirm_password = this.state.confirm_password
		let name = `${this.state.firstName} ${this.state.lastName}`

		if (password === confirm_password){
			createUserWithEmailAndPassword(auth, email, password)
				.then(async(userCredential) => {
					const user = userCredential.user;
					console.log("Firebase User ", user)

					updateProfile(auth.currentUser,{
						displayName: name
					})

					this.setState({
						creatingUser: false
					})
				})

		}
	}

	async setLoginEmail(event){
		this.setState({
			email: event.target.value
		})
	}

	async setLoginPassword(event){
		this.setState({
			password: event.target.value
		})
	}

	async loginUser(){
		let email = this.state.email
		let password = this.state.password

		if(email && password){
			signInWithEmailAndPassword(auth, email, password)
				.then((userCredential) => {
					console.log("Successful Login User", userCredential)
					let user = userCredential.user
					this.setState({
						authenticated: true
					})
					localStorage.setItem("user_token", user.accessToken)
					localStorage.setItem("user_email", user.email)
				})
		}
		
	}

	async checkAuthentication(){
		let token = localStorage.getItem("user_token")
		let email = localStorage.getItem("user_email")
		if (token && email){
			this.setState({
				authenticated: true
			})

			onAuthStateChanged(auth, async(user) => {
      	if (user) {
      		console.log("Firebase Authenticated User", user)
      		this.setState({
      			activeUserName: user.displayName,
      			activeUserEmail: user.email,
      			activeUserPhoto: user.photoURL
      		})

      		const querySnapshot = await getDocs(collection(db, "bookings"));
        	querySnapshot.forEach((doc) => {
          	console.log(doc.id, " => ", doc.data());
        	});
      	}
      })
		}
	}

	async showLogout(){
		this.setState({
			logoutPanel: !this.state.logoutPanel
		})
	}

	async logOut(){
		signOut(auth).then(() => {
			console.log("User Signed Out Successfully")
			localStorage.removeItem("user_email");
			localStorage.removeItem("user_token");

			this.setState({
				authenticated: false
			})
		})
		.catch((error) => {
			console.error("Error Signing Out", error)
		})
	}

	componentDidMount(){
		this.checkAuthentication()
	}

	render(){
		return(
			<div className={styles.container}>
				{
					this.state.authenticated 
					?	<div>
							<div className={styles.topNav}> 
								<div 
									className={styles.profile}
									onClick={this.showLogout}
								>

								</div>

								{
									this.state.logoutPanel
								  ? <div 
											className={styles.profileOptions}
											onClick={this.logOut}
										>
											Logout
										</div>
									: <div></div>
								}
							
							</div>
							<div className={styles.authenticatedData}>
								<div> {this.state.activeUserName} </div>
								<div> {this.state.activeUserEmail} </div>
								<div> {this.state.activeUserPhoto} </div>
							</div>
						</div>
					:   <div className={styles.authContainer}>
							<div className={styles.usersList}>
								Users
							</div>
							<div className={styles.authForm}>
								{
									this.state.creatingUser 
									?   <div className={styles.signupContainer}>
											<div className={styles.signupForm}>
												<div className={styles.nameInput}>
													<input 
														className={styles.firstName} 
														placeholder="First Name"
														onChange={this.setSignupFirstname}
													/>
													<input 
														className={styles.lastName} 
														placeholder="Last Name"
														onChange={this.setSignupLastname}
													/>
												</div>
												<input 
													className={styles.signupInput} 
													placeholder="Enter Your Email"
													type="email"
													onChange={this.setSignupEmail}
												/>
												<input 
													className={styles.signupInput} 
													placeholder="Enter Your Password"
													type="password"
													onChange={this.setSignupPassword}
												/>
												<input 
													className={styles.signupInput} 
													placeholder="Re-enter Your Password"
													type="password"
													onChange={this.setSignupConfirmPassword}
												/>
											</div>
											<div 
												className={styles.createAccount}
												onClick={this.signupNewUser}
											>
												Sign Up 
											</div>
											<div  
												className={styles.haveAccount} 
												onClick={this.startLogin}
											> 
												Already Have An Account ? 
											</div>
										</div>
									:   <div className={styles.loginContainer}>
											<div className={styles.loginForm}>
												<input 
													className={styles.loginInput} 
													type="email"
													placeholder="Enter Your Email"
													onChange={this.setLoginEmail}
												/>
												<input 
													className={styles.loginInput} 
													type="password"
													placeholder="Enter Your Password"
													onChange={this.setLoginPassword}
												/>
												<div 
													className={styles.loginButton}
													onClick={this.loginUser}
												>
													Log in
												</div>
												<div  className={styles.forgotPassword} > 
													Forgetten password ? 
												</div>
											</div>
											<div 
												className={styles.createAccount}
												onClick={this.createUser}
											> 
												Create new account 
											</div>
										</div>
									
								}
								
								
							</div>
						</div>
				}
			</div>
		)
		
	}
}