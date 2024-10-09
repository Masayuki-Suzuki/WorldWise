import styles from './MainSection.module.sass'
import CommonLink from '../../atoms/CommonLink'

const MainSection = () => {
    return (
        <section className={styles.mainSection}>
            <h1>
                You travel the world.
                <br />
                WorldWise keeps track of your adventures.
            </h1>
            <h2>
                A world map that tracks your footsteps into every city you can think of. Never forget your wonderful
                experiences, and show your friends how you have wandered the world.
            </h2>
            <div>
                <CommonLink to="/app">Start tracking now</CommonLink>
            </div>
        </section>
    )
}

export default MainSection
