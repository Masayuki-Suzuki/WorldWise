import styles from './Message.module.sass'

type MessageProps = {
    message: string
    type?: 'error' | 'info'
}

function Message({ message, type = 'info' }: MessageProps) {
    return (
        <p className={styles.message}>
            <span role="img">{type === 'info' ? '👋' : '⛔️'} </span> {message}
        </p>
    )
}

export default Message
