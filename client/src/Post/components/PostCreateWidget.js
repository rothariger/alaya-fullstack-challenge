import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
// Import Style

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

const PostCreateWidget = ({ addPost }) => {
  const [state, setState] = useState({});
  const classes = useStyles();
  const user = useSelector((state) => state.auth?.user);
  const [array, setArray] = useState([]);

  const submit = () => {
    state.name = user;
    state.images = array;
    if (state.title && state.content) {
      addPost(state);
      setState({ title: '', content: '' });
      setArray([]);
    }
  };

  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  };

  const handleImage = async (evt) => {
    try {
      const file = evt.target.files[0];
      const base64 = await convertBase64(file);
      array.push(base64);
      setArray([...array]);
    }
    catch { }
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const deleteImage = (image) => {
    const index = array.indexOf(image);
    array.splice(index, 1);
    setArray([...array]);
  }

  return (
    <div className={`${classes.root} d-flex flex-column my-4 w-100`}>
      <h3>Create new post</h3>
      <TextField variant="filled" label="Author name" name="name" value={user} readonly />
      <TextField variant="filled" label="Post title" name="title" value={state.title} onChange={handleChange} />
      <TextField variant="filled" multiline rows="4" label="Post content" name="content" value={state.content} onChange={handleChange} />
      <Button className="mt-2" variant="contained" component="label">
        Upload
        <input hidden accept="image/*" multiple type="file" onChange={handleImage} />
      </Button>
      {array.map(function (item) {
        return (<img alt="imagen" src={item} onClick={() => { deleteImage(item) }} />)
      })}
      <Button className="mt-4" variant="contained" color="primary" onClick={() => submit()} disabled={!state.title || !state.content}>
        Submit
      </Button>

    </div>
  );
};

PostCreateWidget.propTypes = {
  addPost: PropTypes.func.isRequired
};

export default PostCreateWidget;
