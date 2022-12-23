import styles from "./Point.module.css";

const Point = (props) => {
    const point = props.point;
    
    return (
        <div className={styles.point}>
            <label>Point: </label>
            <input className={styles.input} placeholder={point.x} disabled/>
            <input className={styles.input} placeholder={point.y} disabled/>
        </div>
    )
}

export default Point;