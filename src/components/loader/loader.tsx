import styles from './loader.module.css';

type Props = {
  size?: number;
}

export default function Loader({ size }: Props): JSX.Element {
  return (
    <div className={styles.loader_box} data-testid="loader-box">
      <span
        className={styles.loader}
        style={size ? { width: `${size}px`, height: `${size}px` } : undefined}
        data-testid="loader"
      >
      </span>
    </div>
  );
}
