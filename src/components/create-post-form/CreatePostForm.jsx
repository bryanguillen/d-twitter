import PropTypes from 'prop-types';
import './CreatePostForm.css';

/**
 * UI component for creating a new post
 */
export default function CreatePostForm({
  error,
  value,
  onChangeFileInput,
  onChangeTextInput,
  onSubmit
}) {
  return (
    <form className="create-post-form" onSubmit={onSubmit}>
      <div className="create-post-form-first-row">
        <label className="create-post-form-label" htmlFor="create-post">Create Post</label>
        {error ? <p className="create-post-form-error">Cannot submit an empty form</p> : null}
        <textarea
          className="create-post-form-control"
          id="create-post"
          name="create-post"
          onChange={onChangeTextInput}
          value={value}
        />
      </div>
      <div className="create-post-form-second-row">
        <div className="create-post-form-characters-left">{value.length} / 140</div>
        <div className="create-post-form-buttons-container">
          <div className="create-post-form-file-input-container">
            <input
              accept="image/*"
              className="create-post-form-file-input"
              multiple={false}
              onChange={onChangeFileInput}
              type="file"
            />
            <button className="create-post-form-button-attachment">Browse</button>
          </div>
          <button className="create-post-form-button-submit" type="submit">Submit</button>
        </div>
      </div>
    </form>
  );
}

CreatePostForm.propTypes = {
  /**
   * File
   */
  onChangeFileInput: PropTypes.object,
  /**
   * change handler for text input
   */
  onChangeTextInput: PropTypes.func,
  /**
   * click handler
   */
  onSubmit: PropTypes.func,
  /**
   * Value of the text input
   */
  value: PropTypes.string
};