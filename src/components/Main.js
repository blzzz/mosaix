require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import Field from './FieldComponent';

const GRID_SIZE = 7;
const GRID_SQUARE = GRID_SIZE * GRID_SIZE;
const GRID_ARRAY = Array.apply(null, {length: GRID_SIZE}).map(Number.call, Number);
const SYMBOLS = ['triangle','circle','cross'];
const START_SYMBOL = SYMBOLS[Math.floor(Math.random()*SYMBOLS.length)];
const START_FIELD = [24,26,33,17][Math.floor(Math.random()*4)]

class AppComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = { dices:['','','',''], results:{'triangle':[],'circle':[],'cross':[]} }
  }

  throwDice(){
    let dices = [];
    for (var i = 0; i < 4; i++) {
      dices.push(SYMBOLS[Math.floor(Math.random()*SYMBOLS.length)])
    }
    this.setState({dices})
  }

  calcScores() {

    var checkedFields = [];
    var detectedAreaFields = [];
    for (let i = 0; i < GRID_SQUARE; i++) {
      checkedFields[i] = this.refs[`field-${i+1}`].state.value == '';
    }

    let areas = {
      circle:[],
      cross:[],
      triangle:[]
    };
    for (let i = 0; i < GRID_SQUARE; i++) {

      if (checkedFields[i]) {
        continue;
      }

      let field = this.checkField(i,checkedFields)
      detectedAreaFields = [field];
      detectedAreaFields = this.recursivelyDetectAreaFields(field,checkedFields,detectedAreaFields);

      let scores = detectedAreaFields.length;
      if (scores >= 5) {
        areas[field.state.value].push(scores);
        detectedAreaFields.forEach((f) => {
          f.setToCountable()
        });
      } else {
        detectedAreaFields.forEach((f) => {
          f.setToUncountable()
        });
      }
    }
    this.setState({ results:areas })
  }

  checkField(i, checkedFields) {
    if (checkedFields) {
      checkedFields[i] = true;
    }
    return this.refs[`field-${i+1}`];
  }

  recursivelyDetectAreaFields(field,checkedFields,detectedAreaFields) {
    this.getSameNeightboursOf(field,checkedFields).forEach((n) => {
      let index = n.props.num-1;
      if (!checkedFields[index]) {
        let field = this.checkField(index,checkedFields)
        detectedAreaFields.push(field);
        this.recursivelyDetectAreaFields(field, checkedFields, detectedAreaFields);
      }
    });
    return detectedAreaFields;
  }

  getSameNeightboursOf(ref,checkedFields) {
    let { neighbours } = ref.props;
    let sameNeighbours = [];
    neighbours.forEach((n) => {
      if (n <= 0 || n > GRID_SQUARE) {
        return;
      }
      let neighbourRef = this.refs[`field-${n}`];
      if (neighbourRef.state.value === ref.state.value && !checkedFields[n-1] ) {
        sameNeighbours.push(neighbourRef)
      }
    });
    return sameNeighbours;
  }

  render() {

    let sums = {};
    SYMBOLS.forEach((type)=>{
      let sum = 0;
      this.state.results[type].forEach((scores) => {
        sum += scores;
      })
      sums[type] = sum;
    })

    let num = 0;

    return (
      <div className="index">

        {/*

        <table id="dice">
          <tbody>
            <tr>
              <td
                onClick={this.throwDice.bind(this)}
                style={{background:'transparent', color:'rgb(173, 173, 173)',cursor:'pointer'}}
                >&#9860;</td>
              { this.state.dices.map((dice,i)=>{
                let res
                res = dice === 'triangle' && <td key={`dice-${i}`}>&#9653;</td>
                if (res) {
                  return res
                }
                res = dice === 'circle' && <td key={`dice-${i}`}>&#9711;</td>
                if (res) {
                  return res
                }
                res = dice === 'cross' && <td key={`dice-${i}`}>&#10005;</td>
                if (res) {
                  return res
                } else {
                  return <td key={`dice-${i}`}></td>
                }
              })}
            </tr>
          </tbody>
        </table>
        */}

        <div style={{textAlign:'center',padding:20, letterSpacing:2}}>
          M&#9711;S&#9653;I&#10005;
          <br />
          Virtual Board
        </div>

        <table>
          <tbody>
          {GRID_ARRAY.map((tr) => {
            return (
              <tr key={`row-${tr}`}>
                { GRID_ARRAY.map((tc) => {
                  num++;
                  return <Field
                    neighbours={[
                      num-GRID_SIZE, //top
                      (num%GRID_SIZE==0 ? -1 : num+1), // right
                      num+GRID_SIZE, // bottom
                      (num%GRID_SIZE==1 ? -1 : num-1) // left
                    ]}
                    value={ num==START_FIELD ? START_SYMBOL : ''}
                    key={`field-${num}`}
                    ref={`field-${num}`}
                    onFieldChange={this.calcScores.bind(this)}
                    num={num} />
                })}
              </tr>
            )
          })}
          </tbody>
        </table>

        <table id="result">
          <tbody>
            <tr>
              <td>&#9653;</td>
              <td>{ this.state.results.triangle.length } x {sums.triangle}</td>
              <td>= {this.state.results.triangle.length * sums.triangle}</td>
            </tr>
            <tr>
              <td>&#9711;</td>
              <td>{ this.state.results.circle.length } x {sums.circle}</td>
              <td>= {this.state.results.circle.length * sums.circle}</td>
            </tr>
            <tr>
              <td>&#10005;</td>
              <td>{ this.state.results.cross.length } x {sums.cross}</td>
              <td>= {this.state.results.cross.length * sums.cross}</td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td><strong style={{borderBottom:'3px double'}}>= {
                this.state.results.triangle.length * sums.triangle +
                this.state.results.circle.length * sums.circle +
                this.state.results.cross.length * sums.cross
              }</strong></td>
            </tr>
          </tbody>
        </table>


      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
