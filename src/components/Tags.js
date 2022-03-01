import React, { useCallback, useEffect, useState } from "react";

const TagItem = React.memo(({ tag, onRemove }) => (
  <div onClick={() => onRemove(tag)}>#{tag}</div>
));

const TagList = React.memo(({ tags, onRemove }) => {
  // console.log(tags, "tags");
  return (
    <div>
      {tags.map((tag) => (
        <TagItem key={tag} tag={tag} onRemove={onRemove} />
      ))}
    </div>
  );
});

const TagBox = ({ tags, onChangeTags }) => {
  const [input, setInput] = useState("");
  const [localTags, setLocalTags] = useState([]);

  const insertTag = useCallback(
    (tag) => {
      if (!tag) return;
      if (localTags.includes(tag)) return;
      const nextTags = [...localTags, tag];
      setLocalTags(nextTags);
      onChangeTags(nextTags);
    },
    [localTags, onChangeTags]
  );

  const onRemove = useCallback(
    (tag) => {
      const nextTags = localTags.filter((t) => t !== tag);
      setLocalTags(nextTags);
      onChangeTags(nextTags);
    },
    [localTags, onChangeTags]
  );

  const onChange = useCallback((e) => {
    setInput(e.target.value);
  }, []);

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      insertTag(input.trim());
      setInput("");
    },
    [input, insertTag]
  );

  useEffect(() => {
    setLocalTags(tags);
  }, [tags]);

  return (
    <div>
      <h4>태그</h4>
      <form onSubmit={onSubmit}>
        <input
          placeholder="태그를 추가하세요."
          value={input}
          onChange={onChange}
        />
        <button type="submit">추가</button>
      </form>
      <TagList tags={localTags} onRemove={onRemove} />
    </div>
  );
};

export default TagBox;
