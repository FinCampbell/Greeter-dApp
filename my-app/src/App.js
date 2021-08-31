import React, { Component } from "react";
import Web3 from 'web3';
import './App.css';

import {CONTRACT_ADDRESS, CONTRACT_ABI} from "./config.js";

class App extends Component {

    componentDidMount = async () => {
        try {

            this.setState({loading: true})
            let web3

            if(window.ethereum) {
                web3 = new Web3(window.ethereum)
                await window.ethereum.enable()
                this.setState({web3: web3})

            }

            await this.loadData();
            this.setState({loading: false})
        } catch (error) {
            console.log(error);
        }
    }

    async loadData() {
        const web3 = this.state.web3;
        const accounts = await web3.eth.getAccounts()
        this.setState({ account: accounts[0]} )
        const Greeter = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS)
        this.setState({ Greeter })
        const Greeting = await Greeter.methods.greet().call()
        this.setState({ Greeting })
        console.log(Greeting)
    }

    submitGreeting(content) {
        this.setState({ loading: true})
        this.state.Greeter.methods.setGreeting(content).send({ from: this.state.account})
        .once('receipt', (receipt) => {
            this.setState({ loading: false})
        })
    }

    constructor(props) {
        super(props)
        this.state = { 
            account: '',
            Greeting: '',
            web3: null,
            loading: true
        }
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                    <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="#" target="_blank">Greeting App</a>
                    <ul className="navbar-nav px-3">
                        <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                         <small><a className="nav-link" href={"https://testnet.ftmscan.com/address/"+this.state.account} ><span id="account">{this.state.account}</span></a></small>
                        </li>
                    </ul>
                </nav>
                <div class="seperator" />
                <div className="container">
                    <h1>Hello, World!</h1>
                    <p>Your Greeting is: {this.state.Greeting}</p>
                    <div id="form">
                        <form onSubmit={(event) => {
                            event.preventDefault()
                            this.submitGreeting(this.greeting.value)
                        }}>
                            <input id="newGreeting" ref={(input) => this.greeting = input} type="text" className="form-control" placeholder="New Greeting..." required />
                            <input type="submit" hidden={true} />
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;