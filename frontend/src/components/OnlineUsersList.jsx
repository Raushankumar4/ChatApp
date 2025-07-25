const OnlineUsersList = ({ users }) => (
  <div>
    <h4>Online Users:</h4>
    <ul>
      {users.map((user, i) => <li key={i}>{user}</li>)}
    </ul>
  </div>
);

export default OnlineUsersList;
