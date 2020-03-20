import React from "react";
import { connect } from "react-redux";
import {
  fetchChores,
  fetchChoresForUser,
  updateChore
} from "../../actions/chore_actions";
import { getAcceptedUsers } from "../../actions/user_actions";
import ChoreItem from "./chore_item";
import CreateChoreForm from "./create_chore_form";
import Loader from "react-spinners/BounceLoader";
import { css } from "@emotion/core";

class Chores extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: false, showCreateChoreForm: false };
    this.reassignChores = this.reassignChores.bind(this);
  }

  shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  reassignChores() {
    this.setState({ loading: true });
    let shuffledHousemates = this.shuffle(Object.values(this.props.housemates));
    this.props.chores.forEach((chore, i) => {
      chore.assignedUser =
        shuffledHousemates[i % shuffledHousemates.length]._id;
      this.props.updateChore(chore);
    });

    this.props.fetchChores().then(() => {
      setTimeout(() => this.setState({ loading: false }), 800);
    });
  }

  componentDidMount() {
    this.props.getAcceptedUsers(this.props.currentUser.household).then(() => {
      this.props.fetchChores().then(() => this.setState({ loading: false }));
    });
  }

  render() {
    if (this.state.loading) {
      const override = css`
        display: block;
        margin: auto;
        border-color: white;
      `;
      return (
        <div className="loading submit-loading">
          <Loader
            css={override}
            size={20}
            color={"#1a7d88"}
            loading={this.state.loading}
          />
        </div>
      );
    }

    if (this.props.chores.length === 0) {
      return (
        <div>
          <div>No Chores Yet</div>
          <CreateChoreForm />
        </div>
      );
    }
    let allChoreItems = this.props.chores.map(chore => {
      return (
        <ChoreItem
          key={chore._id}
          chore={chore}
          housemates={this.props.housemates}
          updateChore={this.props.updateChore}
        />
      );
    });

    return (
      <div>
        <h2>All Household Chores</h2>
        <div>
          <button onClick={this.reassignChores}>Reassign All Chores</button>
        </div>
        <ol>{allChoreItems}</ol>
        {/* <h2>Your Assigned Chores</h2> */}
        <CreateChoreForm />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    chores: Object.values(state.entities.chores),
    currentUser: state.session.user,
    housemates: state.entities.users
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchChores: () => dispatch(fetchChores()),
    fetchChoresForUser: user => dispatch(fetchChoresForUser(user)),
    updateChore: chore => dispatch(updateChore(chore)),
    getAcceptedUsers: householdId => dispatch(getAcceptedUsers(householdId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chores);
