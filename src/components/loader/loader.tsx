import styles from './loader.module.css';

type Props = {
  size?: number;
}

export default function Loader({ size }: Props): JSX.Element {
  return (
    <div className={styles.loader_box}>
      <span className={styles.loader} style={size ? { width: `${size}px`, height: `${size}px` } : undefined} ></span>
    </div>
  );
}
