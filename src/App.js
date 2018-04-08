import React, { Component } from 'react';
import _ from 'lodash';
import axios from 'axios';

import Select from 'react-select';
import 'react-select/dist/react-select.css';
import './App.css';

const bonuses = {
  junior: [
    {value: 'j1', label: 'Если работает в команде, то может работать над средними проектами.'},
    {value: 'j2', label: 'Если работает в одиночку, то может работать над средними проектами.'},
    {value: 'j3', label: 'Если работает в команде, то скорость возрастает'},
    {value: 'j4', label: 'Если работает в одиночку, то скорость возрастает'}
  ],
  specialist: [
    {value: 's1', label: 'Все члены вашей команды получают +1 к дизайну.'},
    {value: 's2', label: 'Все члены вашей команды получают +1 к инжинирингу.'},
    {value: 's3', label: 'Все члены вашей команды получают +1 к креативу.'}
  ],
  expert: [
    {value: 'e1', label: 'Если работает в команде, то скорость падает'},
    {value: 'e2', label: 'Если работает в одиночку, то скорость падает'},
    {value: 'e3', label: 'После окончания вами проекта положите этого члена команды вниз библиотеки.'},
    {value: 'e4', label: 'После окончания опонентом проекта положите этого члена команды вниз библиотеки.'},
    {value: 'e5', label: 'Каждый ход в начале хода киньте кубик. Если выпало 1 — положите этого члена команды вниз библиотеки.'},
    {value: 'e6', label: 'Каждый ход в конце хода киньте кубик. Если выпало 1 — положите этого члена команды вниз библиотеки.'}
  ],
};

const marks = [
  '0',
  'Абсолютный бездарь',
  'Отдаленное понимание',
  'Любительское понимание',
  'Молодой специалист',
  'Специалист',
  'Опытный специалист',
  'Уверенный профессионал',
  'Исключительный профессионал',
  'Признанный гуру'
];

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      high_bonus: 1,
      //mid_bonus: 0.9410360288810285, // 15
      mid_bonus: 0.8972021020145473, // 13
      low_bonus: 0.7937005259841, // 9
      //mid_bonus: 0.873580464736298857, // 12
      //low_bonus: 0.693361274350634716, // 6

      name: 'Name Secondname',

      expr: 'specialist',
      speed: 'normal',
      team: 'teamplayer',

      design: _.random(2, 4),
      engineering: _.random(2, 4),
      creative: _.random(2, 4),

      bonus: '',

      cards: [],
      response: null,

      posted: false,
    };


    this.exprOptionChange = this.exprOptionChange.bind(this);
    this.speedOptionChange = this.speedOptionChange.bind(this);
    this.teamOptionChange = this.teamOptionChange.bind(this);
    this.bonusOptionChange = this.bonusOptionChange.bind(this);

    this.calcSkillsSum = this.calcSkillsSum.bind(this);

    this.raise_skill = this.raise_skill.bind(this);
    this.lower_skill = this.lower_skill.bind(this);

    this.postBuild = this.postBuild.bind(this);
  }


  componentDidMount() {
    this.updateList();
  }

  updateList() {
    axios.get('/list')
        .then(res => {
          console.log(res);
          //const posts = res.data.map(obj => obj.data);
          const posts = _.reverse(res.data);
          console.log(posts);
          this.setState({ cards: posts });
        });
  }


  exprOptionChange(changeEvent) {
    this.setState({
      expr: changeEvent.target.value,
      bonus: ''
    }, () => this.skill_check() );
  }

  speedOptionChange(changeEvent) {
    this.setState({
      speed: changeEvent.target.value
    }, () => this.skill_check() );
  }

  teamOptionChange(changeEvent) {
    this.setState({
      team: changeEvent.target.value
    }, () => this.skill_check() );
  }

  skill_check() {
    //console.log(this.stats_sum(), this.calcSkillsSum(), this.state);
    if (this.stats_sum() > this.calcSkillsSum()) {
      let difference = this.stats_sum() - this.calcSkillsSum();

      for (var i = 0; i < difference; i++) {
        if (this.state.design >= this.state.engineering || this.state.design >= this.state.creative ) {
          this.lower_skill('design');
        }
        if (this.state.engineering >= this.state.design || this.state.engineering >= this.state.creative ) {
          this.lower_skill('engineering');
        }
        if (this.state.creative >= this.state.engineering || this.state.creative >= this.state.design ) {
          this.lower_skill('creative');
        }
      };

    }
  }

  bonusOptionChange(changeEvent) {

    //this.setState({ changeEvent });
    console.log(`Selected: ${changeEvent.label}`);

    this.setState({
      bonus: changeEvent
    });
  }

  calcSkillsSum() {
    var base = 18;

    switch (this.state.expr) {
      case 'junior':
        base *= this.state.low_bonus;
        break;
      case 'specialist':
        base *= this.state.mid_bonus;
        break;
      case 'expert':
        base *= this.state.high_bonus;
        break;
      default:
        console.log('error case: ' + this.state.expr);
    }

    switch (this.state.speed) {
      case 'slow':
        base *= this.state.high_bonus;
        break;
      case 'normal':
        base *= this.state.mid_bonus;
        break;
      case 'fast':
        base *= this.state.low_bonus;
        break;
      default:
        console.log('error case: ' + this.state.speed);
    }

    switch (this.state.team) {
      case 'alone':
        base *= this.state.high_bonus;
        break;
      case 'teamplayer':
        base *= this.state.mid_bonus;
        break;
      case 'leader':
        base *= this.state.low_bonus;
        break;
      default:
        console.log('error case: ' + this.state.team);
    }


    return Math.floor(base);
  }

  raise_skill(skill) {
    if (this.state[skill] < 9 && this.stats_sum() < this.calcSkillsSum() ) {
      let o = {};
      o[skill] = this.state[skill] + 1;
      this.setState(o)
    }
  }

  lower_skill(skill) {
    if (this.state[skill] > 1) {
      let o = {};
      o[skill] = this.state[skill] - 1;
      this.setState(o)
    }
  }

  stats_sum() {
    return this.state.design + this.state.engineering + this.state.creative;
  }

  postBuild() {
    let build = {
      name: this.state.name,
      expr: this.state.expr,
      speed: this.state.speed,
      team: this.state.team,
      design: this.state.design,
      engineering: this.state.engineering,
      creative: this.state.creative,
      bonus: this.state.bonus.label
    };

    axios.post('/add', build)
        .then(res => {
          console.log(res);
          this.setState({ posted: true});
          this.updateList();
        });

  }


  render() {
    const make_text = (name, key) =>
        <div className="text">
          {name} <input type="text" name="key" className="form-inline"
                            value={this.state[key]}
                            onChange={(event) => {
                              let o = {};
                              o[key] = event.target.value;
                              this.setState(o)
                            }}
        />
        </div>

    const make_radio = (type, key, callback, text) =>
      <div className="radio">
        <label>
          <input type="radio" value={key}
                 checked={(() => { return this.state[type] === key; })()}
                 onChange={callback} />
          {text}
        </label>
      </div>


    return (
      <div className="App">
        <div className="container theme-showcase" role="main">
        <h3 className="App-title">Build your Hero</h3>

        <div className="form">

          {make_text("Your name", "name")}

          <div name = 'setup' style={{display: 'none'}}>
          <h3 className="App-title">Setup const</h3>
          {make_text("Mid_bonus", "mid_bonus")}
          {make_text("Low_bonus", "low_bonus")}
          </div>

          <h4 className="App-title">Select experience</h4>

          <div className="datablock" name = 'expr'>
            Choose your experience:
            {make_radio("expr", "junior", this.exprOptionChange, "Junior — you can work only with small projects")}
            {make_radio("expr", "specialist", this.exprOptionChange, "Specialist — you can work with small amd medium projects")}
            {make_radio("expr", "expert", this.exprOptionChange, "Expert — you can work with projects of any size (even big)")}
          </div>


          <div className="bonus">
            <h4 className="App-title">Select feature</h4>
            <Select
                name="form-field-name"
                value={this.state.bonus}
                onChange={this.bonusOptionChange}
                options={bonuses[this.state.expr]}
            />
          </div>

          <h4 className="App-title">Choose perks</h4>

          <div className="flex-container-row">
            <div className="datablock flex-element" name = 'speed'>
              Choose your workspeed:
              {make_radio("speed", "slow", this.speedOptionChange, "Slow — your workspeed halved")}
              {make_radio("speed", "normal", this.speedOptionChange, "Normal workspeed")}
              {make_radio("speed", "fast", this.speedOptionChange, "Fast — your wokrspeed is 1.5 faster")}
            </div>

            <div className="datablock flex-element" name = 'team'>
              Choose your communication skills:
              {make_radio("team", "alone", this.teamOptionChange, "You can work only alone")}
              {make_radio("team", "teamplayer", this.teamOptionChange, "You can work with a partner")}
              {make_radio("team", "leader", this.teamOptionChange, "You can work with a team")}
            </div>
          </div>

          <h4 className="App-title">Form Skills</h4>
          <div>
            Summ of your skills should be: {this.calcSkillsSum()} ({this.stats_sum()} used)
          </div>
          <div className="datablock">
            <div name = 'design'>
              Design
              <button onClick={() => {this.lower_skill('design')}}> {'<'} </button>
              <span className="font-weight-bold"> {this.state.design} </span>
              <button onClick={() => {this.raise_skill('design')}}> {'>'} </button>
              {marks[this.state.design]}
            </div>
            <div name = 'engineering'>
              Engineering
              <button onClick={() => {this.lower_skill('engineering')}}> {'<'} </button>
              <span className="font-weight-bold"> {this.state.engineering} </span>
              <button onClick={() => {this.raise_skill('engineering')}}> {'>'} </button>
              {marks[this.state.engineering]}
            </div>
            <div name = 'creative'>
              Creative
              <button onClick={() => {this.lower_skill('creative')}}> {'<'} </button>
              <span className="font-weight-bold"> {this.state.creative} </span>
              <button onClick={() => {this.raise_skill('creative')}}> {'>'} </button>
              {marks[this.state.creative]}
            </div>
          </div>

          <div>
            {this.state.posted ?
                <button className="btn btn-info"> Posted! </button> :
                <button className="btn btn-success" onClick={() => { this.postBuild(); }}> Post build! </button>}
          </div>

          </div>

          <div>
            <h4 className="App-title">Resent builds:</h4>

            <table className="table">
              <thead>
              <tr key='head'>
                <td>Name</td>
                <td>Expr</td>
                <td>Speed</td>
                <td>Team</td>
                <td>Design</td>
                <td>Engineering</td>
                <td>Creative</td>
                <td>Bonus</td>
              </tr>
              </thead>
              <tbody>
              {this.state.cards.map((row) =>
                  <tr key={row._id} >
                    <td>{row.name}</td>
                    <td>{row.expr}</td>
                    <td>{row.speed}</td>
                    <td>{row.team}</td>
                    <td>{row.design}</td>
                    <td>{row.engineering}</td>
                    <td>{row.creative}</td>
                    <td>
                      <img src="hand.png" width={32} height={24} title={row.bonus} alt="hower" />
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    );
  }
}

export default App;
