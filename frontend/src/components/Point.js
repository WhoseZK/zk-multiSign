import styles from "./Point.module.css";

const Point = (props) => {
    const point = props.point;
    
    return (
        <div className={styles.point}>
            <label>Point: </label>
            <input className={styles.input} placeholder={point.x.toString()} disabled/>
            <input className={styles.input} placeholder={point.y.toString()} disabled/>
        </div>
    )
}

export default Point;