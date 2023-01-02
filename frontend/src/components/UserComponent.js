
const UserComponent = (props) => {
    return (
        <div className="container">
            <label htmlFor="sharingKey">Username: </label>
            <p>{props.name}</p>
            <label htmlFor="publicKey">Public Key x: </label>
            <p>{props.x}</p>
            <label htmlFor="publicKey">Public Key y: </label>
            <p>{props.y}</p>
            <label htmlFor="privatekey">Private Key: </label>
            <p>{props.prvKey}</p>
        </div>
    );
}

export default UserComponent;


