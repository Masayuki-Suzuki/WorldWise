import styles from './Message.module.sass'

type MessageProps = {
    message: string
}

function Message({ message }: MessageProps) {
    return (
        <p className={styles.message}>
            <span role="img">👋</span> {message}
        </p>
    )
}

export default Message
