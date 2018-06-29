import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import firebase from '../firebase';

const Container = styled.div`
  max-width: 340px;
  margin: auto;
`;

const Label = styled.label`
  display: block;
  color: blue;
  font-weight: bold;
  font-size: 13px;
  margin-bottom: 8px;
`;

const Input = styled.input`
  display: block;
  background: white;
  padding: 1em;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
  font-size: 16px;
  margin-bottom: 1.5em;
`;

const SubmitButton = styled.input.attrs({
  type: 'submit'
})`
  cursor: pointer;
  display: block;
  background: black;
  color: white;
  padding: 1em;
  width: 100%;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
  text-align: center;

  &:hover {
    background: #222;
  }
`;

const Textarea = Input.withComponent('textarea');

class NewBoard extends Component {
  state = {
    errors: {}
  };

  handleSubmit = event => {
    event.preventDefault();

    const name = event.target.name.value;
    const description = event.target.description.value;

    const board = {
      name,
      description
    };

    if (this.validate(board)) {
      this.create();
    }
  };

  validate(board = {}) {
    let valid = true;
    const errors = {};

    if (!board.name) {
      errors.name = 'Name is required';
      valid = false;
    }

    this.setState({ errors });

    return valid;
  }

  async create(board) {
    try {
      const newBoard = await firebase.createBoard(board);
      this.props.history.replace(`/boards/${newBoard.id}`);
    } catch (err) {
      this.setState(({ errors }) => ({
        ...errors,
        global: err
      }));
    }
  }

  renderErrorMessage = field => {
    const error = this.state.errors[field];
    return error && <small style={{ color: 'red' }}>{error}</small>;
  };

  render() {
    return (
      <Container>
        {this.renderErrorMessage('global')}

        <form autoComplete="off" onSubmit={this.handleSubmit}>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input name="name" type="text" placeholder="Board Name" />
            {this.renderErrorMessage('name')}
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              name="description"
              type="text"
              placeholder="Description"
            />
            {this.renderErrorMessage('description')}
          </div>

          <SubmitButton value="Create Board" />
        </form>
      </Container>
    );
  }
}

NewBoard.propTypes = {
  history: PropTypes.shape({
    replace: PropTypes.func
  }).isRequired
};

export default NewBoard;
