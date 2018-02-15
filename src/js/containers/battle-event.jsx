//presets
import React from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

//importing actions
import actions from "../actions/all-actions.jsx";

//classes
class Battle extends React.Component {
    constructor(props) {
        super(props);
        const playerBaseStamina = this.props.battleReducer.playerPokemon.stamina;
        const randomBaseStamina = this.props.battleReducer.randomPokemon.stamina;
        this.state = {
            displayAttacks: "block",
            displayText: "none",
            textArea: "battle begins!",
            playerBaseStamina: playerBaseStamina,
            randomBaseStamina: randomBaseStamina,
            counter: playerBaseStamina
        };
    };

    handleAttackAction (attack) { // wymaga optymalizacji
        let playerPokemon = this.props.battleReducer.playerPokemon;
        let randomPokemon = this.props.battleReducer.randomPokemon;
        if (attack.type === "modifying_myself" || attack.type === "modifying_enemy") {
            this.setState({
                displayText: "block",
                displayAttacks: "none",
                textArea: playerPokemon.id + " uses " + attack.id
            })
        } else {this.setState ({
            displayText: "block",
            displayAttacks: "none",
            textArea: playerPokemon.id + " attacks with " + attack.id
        })
        }
        setTimeout(() => {
            let randomPokemonStamina = this.props.battleReducer.randomPokemon.stamina;
            this.props.playerClickedAttack(attack, this.state.playerBaseStamina );
            if (attack.type === "modifying_myself") {
                if (attack.targetName === "stamina") {
                    if (this.state.playerBaseStamina === playerPokemon.stamina) {
                        this.setState ({
                            textArea: playerPokemon.id + " cannot regenerate more stamina then it already has"
                        })
                    } else {
                        this.setState ({
                            textArea: playerPokemon.id + " regenerated " + attack.power + " points of stamina"
                        })
                    }
                } else {
                    this.setState ({
                        textArea: playerPokemon.id + " " + attack.targetName + " rose!"
                    })
                }
            } else if (attack.type === "modifying_enemy") {
                this.setState ({
                    textArea: randomPokemon.id + " " + attack.targetName + " fell!"
                })
            } else if (attack.type === "normal" || attack.type === "special") {
                if (randomPokemonStamina === this.props.battleReducer.randomPokemon.stamina) {
                    this.setState ({
                        textArea: playerPokemon.id + " missed"
                    })
                }
            }
            if (this.props.battleReducer.randomPokemon.stamina >= 0) {
                setTimeout(() => {
                    const randomAttack = randomPokemon.attacks[Math.floor(Math.random()*3)];
                    if (randomAttack.type === "modifying_myself" || randomAttack.type === "modifying_enemy") {
                        this.setState({
                            textArea: randomPokemon.id + " uses " + randomAttack.id
                        })
                    } else {
                        this.setState ({
                            textArea: randomPokemon.id + " attacks with " + randomAttack.id
                        })
                    }
                    setTimeout(() => {
                        let playerPokemonStamina = this.props.battleReducer.playerPokemon.stamina;
                        this.props.randomSelectedAttack(randomAttack, this.state.randomBaseStamina);
                        if (randomAttack.type === "modifying_myself") {
                            if (randomAttack.targetName === "stamina") {
                                if (this.state.randomBaseStamina === randomPokemon.stamina) {
                                    this.setState ({
                                        textArea: randomPokemon.id + " cannot regenerate more stamina then it already has"
                                    })
                                } else {
                                    this.setState ({
                                        textArea: randomPokemon.id + " regenerated " + randomAttack.power + " points of stamina"
                                    })
                                }
                            } else {
                                this.setState ({
                                    textArea: randomPokemon.id + " " + randomAttack.targetName + " rose!"
                                })
                            }
                        } else if (randomAttack.type === "modifying_enemy") {
                            this.setState ({
                                textArea: playerPokemon.id + " " + randomAttack.targetName + " fell!"
                            })
                        } else if (randomAttack.type === "normal" || randomAttack.type === "special") {
                            if (playerPokemonStamina === this.props.battleReducer.playerPokemon.stamina) {
                                this.setState ({
                                    textArea: randomPokemon.id + " missed"
                                })
                            }
                        }
                        if (this.props.battleReducer.playerPokemon.stamina <= 0) {
                            setTimeout(() => {
                                this.setState ({
                                    display: "none",
                                    textArea: playerPokemon.id + " fainted"
                                });
                                setTimeout(() => {
                                    this.props.passingWinnerInfo(randomPokemon);
                                    this.props.onConfirm();
                                },3500);
                            },3000)
                        } else {
                            setTimeout(() => {
                                this.setState({
                                    displayText: "none",
                                    displayAttacks: "block",
                                    textArea: "waiting for next move"
                                })
                            }, 2000);
                        }
                    },3000);
                },3000);
            } else {
                setTimeout(() => {
                    this.setState ({
                        displayAttacks: "none",
                        textArea: randomPokemon.id + " fainted"
                    });
                    setTimeout(() => {
                        this.props.onConfirm();
                        this.props.passingWinnerInfo(playerPokemon);
                    },2500);
                },2000)
            }
        },2000);
    };

    handleLifeBarChange = (staticStaminaValue, changingPokemonStamina) => {
        const lifeBarLength = ((changingPokemonStamina * 100) / staticStaminaValue);
        if (lifeBarLength <= 0) {
            return 0
        } else if (lifeBarLength > 100) {
            return 100;
        } else {
            return lifeBarLength;
        }
    };

    handleColorChange = (functionA) => {
       if (functionA <= 19) {
           return "#e60000";
       } else if (functionA <= 50) {
           return "#ffdb4d"
        } else {
           return "#1aff66"
       }
    };

    generateProperBackground = (type) => {
        if (type === "grass") {
            return "#00b33c"
        }
        if (type === "water") {
            return "#4dc3ff"
        }
        if (type === "fire") {
            return "#ff6600"
        }
        if (type === "normal") {
            return "#b8b894"
        }
        if (type === "electric") {
            return "#ffd11a"
        }
        if (type === "ice") {
            return "#99ffff"
        }
        if (type === "fighting") {
            return "#cc3300"
        }
        if (type === "poison") {
            return "#9933ff"
        }
        if (type === "ground") {
            return "#cc9900"
        }
        if (type === "flying") {
            return "#d9b3ff"
        }
        if (type === "psychic") {
            return "#ff80bf"
        }
        if (type === "bug") {
            return "#99e600"
        }
        if (type === "rock") {
            return "#aaaa55"
        }
        if (type === "ghost") {
            return "#8a00e6"
        }
        if (type === "dark") {
            return "#55552b"
        }
        if (type === "dragon") {
            return "#6600ff"
        }
        if (type === "steel") {
            return "#a6a6a6"
        }
        if (type === "fairy") {
            return "#ffcccc"
        }
    };

    checkArray = (a) => {
        console.log(a.weakTo.indexOf("ice"));
    };

    render () {
        this.checkArray(this.props.battleReducer.playerPokemon);
        const attacks = this.props.battleReducer.playerPokemon.attacks;
        const playerPokeStamina = this.props.battleReducer.playerPokemon.stamina;
        const randomPokeStamina = this.props.battleReducer.randomPokemon.stamina;
        const pickedAttack = this.props.battleReducer.attackToDisplay;
        let handleLifeBar1 = this.handleLifeBarChange(this.state.randomBaseStamina,randomPokeStamina);
        let handleLifeBar2 = this.handleLifeBarChange(this.state.playerBaseStamina,playerPokeStamina);
        const attackData = (pickedAttack === null? this.props.battleReducer.playerPokemon.attacks[0] : pickedAttack);
        return <div className = "game-framing">
                    <div className = "border">
                        <div className = "row-1-2">
                            <div className = "background">
                                <div className = "col-1-2">
                                    <div className = "inner-row-1-2b" >
                                        <div className = "pokemon-data-border">
                                            <div className = "pokemon-data">
                                                <div className = "pokemon-name-in-data">{this.props.battleReducer.randomPokemon.id}</div>
                                                <div className = "life-bar-overbar">
                                                    <div className = "life-bar-inner-line">
                                                        <div className = "life-bar" style = {{transition: "all 1s ease-out", backgroundColor: this.handleColorChange(handleLifeBar1), height: "5px", width: handleLifeBar1}}></div>
                                                    </div>
                                                </div>
                                                <div className = "stamina-points">{randomPokeStamina}/{this.state.randomBaseStamina}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className = "inner-row-1-2c" >
                                        <img className="player-pokemon-img" src={this.props.battleReducer.playerPokemon.gif_back} alt=""/>
                                    </div>
                                </div>
                                <div className= "col-1-2">
                                    <div className = "inner-row-1-2a" >
                                        <img className = "random-pokemon-img" src={this.props.battleReducer.randomPokemon.gif_calm} alt=""/>
                                    </div>
                                    <div className = "inner-row-1-2" >
                                        <div className = "pokemon-data-border">
                                            <div className = "pokemon-data" >
                                                <div className = "pokemon-name-in-data">{this.props.battleReducer.playerPokemon.id}</div>
                                                <div className= "life-bar-overbar">
                                                    <div className = "life-bar-inner-line">
                                                        <div style = {{transition: "all 1s ease-out", backgroundColor: this.handleColorChange(handleLifeBar2), height: "5px", width: handleLifeBar2}}></div>
                                                    </div>
                                                </div>
                                                <div className = "stamina-points">{playerPokeStamina}/{this.state.playerBaseStamina}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className = "row-1-2">
                            <div className = "display-window">
                                <div style = {{display: this.state.displayAttacks}}>
                                    <div className = "attacks-menu">
                                        <div className = "list-of-attack-buttons">
                                            <div>
                                                <div className ="attack-button" onMouseEnter={() => this.props.passingAttackInfo(attacks[0])} onClick = {() => this.handleAttackAction(attacks[0])}>{attacks[0].id}</div>
                                                <div className ="attack-button" onMouseEnter={() => this.props.passingAttackInfo(attacks[1])} onClick = {() => this.handleAttackAction(attacks[1])}>{attacks[1].id}</div>
                                            </div>
                                            <div>
                                                <div className ="attack-button" onMouseEnter={() => this.props.passingAttackInfo(attacks[2])} onClick = {() => this.handleAttackAction(attacks[2])}>{attacks[2].id}</div>
                                                <div className ="attack-button" onMouseEnter={() => this.props.passingAttackInfo(attacks[3])} onClick = {() => this.handleAttackAction(attacks[3])}>{attacks[3].id}</div>
                                            </div>
                                        </div>
                                        <div className = "attack-info">
                                            <div className = "attack-type" style = {{backgroundColor: this.generateProperBackground(attackData.nature)}}>{attackData.nature}</div>
                                            <div className = "attack-power">power:{attackData.power}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className = "battle-commentary-border" style = {{display: this.state.displayText}}>
                                    <div className = "battle-commentary-inner-border">
                                        <div className = "commentary-size">
                                            <div className = "battle-commentary">{this.state.textArea}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
        </div>
    }
}

function mapStateToProps(state) {
    return {
        battleReducer: state.battleReducer
    }
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        playerClickedAttack: actions.playerClickedAttack,
        randomSelectedAttack: actions.randomSelectedAttack,
        passingWinnerInfo: actions.passingWinnerInfo,
        passingAttackInfo: actions.passingAttackInfo
    }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(Battle);



