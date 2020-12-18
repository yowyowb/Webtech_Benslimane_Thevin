
/** @jsx jsx */
import { jsx } from '@emotion/core'

const styles = {
  footer: {
    fontSize : 'small',
    height: '30px',
    backgroundColor: 'rgba(255,255,255,.3)',
    flexShrink: 0,
  },
  span: {
    position : 'relative',
    top : '5px',
    left : '5px',
  }
}

export default () => {
  return (
    <footer style={styles.footer}>
      <span style={styles.span}>
      Made by V. J. THEVIN and Y. BENSLIMANE for ECE project
      </span>
    </footer>
  );
}
