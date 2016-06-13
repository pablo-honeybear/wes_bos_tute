import React from 'react';
import AddFishForm from './AddFishForm';
import autobind from 'autobind-decorator';
import Firebase from 'firebase';
const ref = new Firebase('https://catch-of-the-day-c3b3a.firebaseio.com/');

@autobind
class Inventory extends React.Component {
  constructor() {
    super();

    this.state = {
      uid : ''
    }
  }
  authenticate(provider) {
    console.log("Trying to Auth" + provider);
    ref.authWithOAuthPopup(provider, function(err, authData) {
      console.log(authData);
    });
  }

  renderLogin() {
    return(
      <nav className="login">
        <h2>Inventory</h2>
        <p>Sign in to manage your store's inventory</p>
        <button className="github" onClick={this.authenticate.bind(this, 'github')}>Login With Github</button>
        <button className="facebook" onClick={this.authenticate.bind(this, 'facebook')}>Login With Facebook</button>
      </nav>
    )
  }

  renderInventory(key) {
    var linkState = this.props.linkState;
    return (
      <div className="fish-edit" key={key}>
        <input type="text" valueLink={linkState('fishes.'+ key +'.name')}/>
        <input type="text" valueLink={linkState('fishes.'+ key +'.price')}/>
        <select valueLink={linkState('fishes.'+ key +'.status')}>
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea type="text" valueLink={linkState('fishes.'+ key +'.desc')}></textarea>
        <input type="text" valueLink={linkState('fishes.'+ key +'.image')}/>
        <button onClick={this.props.removeFish.bind(null, key)}>Remove Fish</button>
      </div>
    )
  }

  render() {
    let logoutButton = <button>Log Out!</button>

    //first check Login
    if(!this.state.uid) {
      return (
        <div>
          {this.renderLogin()}
        </div>
      )
    }
    //check if not the owner
      if(this.state.uid !== this.state.owner) {
        return(
          <div>
            <p>Sorry you aren't the owner of this store</p>
            {logoutButton}
          </div>
        )
      }
    return(
      <div>
        <h2>Inventory</h2>
        {logoutButton}
        {Object.keys(this.props.fishes).map(this.renderInventory)}

        <AddFishForm {...this.props} />
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
      </div>
    )
  }
};

Inventory.propTypes = {
  addFish : React.PropTypes.func.isRequired,
  loadSamples : React.PropTypes.func.isRequired,
  fishes : React.PropTypes.object.isRequired,
  linkState : React.PropTypes.func.isRequired,
  removeFish : React.PropTypes.func.isRequired
}


export default Inventory;
