import React, { Component } from 'react';
import _ from 'lodash';
import axios from 'axios';

import Select from 'react-select';
import 'react-select/dist/react-select.css';
import './App.css';

const bonuses = {
  junior: [
    {value: 'j1', label: 'Able to work on medium projects when works in a team.'},
    {value: 'j2', label: 'Able to work on medium projects when works alone.'},
    {value: 'j3', label: 'Speed increases when works in a team'},
    {value: 'j4', label: 'Speed increases when works alone'}
  ],
  specialist: [
    {value: 's1', label: 'All members of your team get +1 to design.'},
    {value: 's2', label: 'All members of your team get +1 to engineering.'},
    {value: 's3', label: 'All members of your team get +1 to creative.'}
  ],
  expert: [
    {value: 'e1', label: 'Speed is slowing down when works in a team.'},
    {value: 'e2', label: 'Speed is slowing down when works alone.'},
    {value: 'e3', label: 'Put this team member down the library after you finish the project.'},
    {value: 'e4', label: 'Put this team member down the library after an opponent finishes the project.'},
    {value: 'e5', label: 'At the beginning of each turn roll the cube. If dropped 1 - put this team member down the library.'},
    {value: 'e6', label: 'At the end of each turn roll the cube. If dropped 1 - put this team member down the library.'}
  ],
};

const marks = [
  '0',
  'Absolute incompetent',
  'Slightly understand',
  'Dilettante understanding',
  'Young specialist',
  'Specialist',
  'Experienced specialist',
  'Confident professional',
  'Exceptional professional',
  'Recognized guru'
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

      posted: false,
    };

    this.customOptionChange = this.customOptionChange.bind(this);
    this.calcSkillsSum = this.calcSkillsSum.bind(this);

    this.raise_stat = this.raise_stat.bind(this);
    this.lower_stat = this.lower_stat.bind(this);

    this.postBuild = this.postBuild.bind(this);
  }


  componentDidMount() {
    this.updateList();
  }

  updateList() {
    axios.get('/list')
        .then(res => {
          console.log(res);
          const posts = _.reverse(res.data);
          console.log(posts);
          this.setState({ cards: posts });
        });
  }

  customOptionChange(event, key, unpack = true) {
    console.log(event);
    console.log(key, unpack ? event.target.value : event);
    let o = {};
    o[key] = unpack ? event.target.value : event;
    this.setState(o, () => this.skill_check() );
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
      }
    }
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

  raise_stat(skill) {
    if (this.state[skill] < 9 && this.stats_sum() < this.calcSkillsSum() ) {
      let o = {};
      o[skill] = this.state[skill] + 1;
      this.setState(o)
    }
  }

  lower_stat(skill) {
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
    const make_text = (stat, name) =>
      <div className="text">
        {name}
        <input type="text" name="key" className="form-inline"
          value={this.state[stat]}
          onChange={(event) => {
            let o = {};
            o[stat] = event.target.value;
            this.setState(o)
          }}
      />
      </div>;

    const make_radio = (stat, key, text) =>
      <div className="radio">
        <label>
          <input type="radio" value={key}
                 checked={(() => { return this.state[stat] === key; })()}
                 onChange={(changeEvent) =>  { this.customOptionChange(changeEvent, stat); }} />
          {text}
        </label>
      </div>;

    const make_arrows = (stat, name) =>
      <div name = {stat}>
        {name}
        <button onClick={() => {this.lower_stat(stat)}}> {'<'} </button>
        <span className="font-weight-bold"> {this.state[stat]} </span>
        <button onClick={() => {this.raise_stat(stat)}}> {'>'} </button>
        {marks[this.state[stat]]}
      </div>;

    const make_select = (stat, options) =>
        <div className={stat}>
          <Select
            name="form-field-name"
            value={this.state[stat]}
            onChange={(changeEvent) =>  { this.customOptionChange(changeEvent, stat, false); }}
            options={options}
          />
        </div>;


    return (
      <div className="App">
        <div className="container theme-showcase" role="main">
          <h3 className="App-title">Build your Hero</h3>
          <div className="form">

            {make_text("name", "Your name")}

            <div name = 'setup' style={{display: 'none'}}>
            <h3 className="App-title">Setup const</h3>
            {make_text("mid_bonus", "Mid_bonus")}
            {make_text("low_bonus", "Low_bonus")}
            </div>

            <h4 className="App-title">Select experience</h4>
            <div className="datablock" name = 'expr'>
              Choose your experience:
              {make_radio("expr", "junior", "Junior — you can work only with small projects")}
              {make_radio("expr", "specialist", "Specialist — you can work with small amd medium projects")}
              {make_radio("expr", "expert", "Expert — you can work with projects of any size (even big)")}
            </div>


            <div className="bonus">
              <h4 className="App-title">Select feature</h4>
              {make_select('bonus', bonuses[this.state.expr])}
            </div>

            <h4 className="App-title">Choose perks</h4>
            <div className="flex-container-row">
              <div className="datablock flex-element" name = 'speed'>
                Choose your workspeed:
                {make_radio("speed", "slow", "Slow — your workspeed halved")}
                {make_radio("speed", "normal", "Normal workspeed")}
                {make_radio("speed", "fast", "Fast — your wokrspeed is 1.5 faster")}
              </div>

              <div className="datablock flex-element" name = 'team'>
                Choose your communication skills:
                {make_radio("team", "alone", "You can work only alone")}
                {make_radio("team", "teamplayer", "You can work with a partner")}
                {make_radio("team", "leader", "You can work with a team")}
              </div>
            </div>

            <h4 className="App-title">Form Skills</h4>
            <div>
              Summ of your skills should be: {this.calcSkillsSum()} ({this.stats_sum()} used)
            </div>
            <div className="datablock">
              {make_arrows("design", "Design")}
              {make_arrows("engineering", "Engineering")}
              {make_arrows("creative", "Creative")}
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
