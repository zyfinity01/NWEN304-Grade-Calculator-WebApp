import Card from "../components/Card"
import {posts} from "../data"

const Home = () => {
    return (
        <div className="homeContainer">
            <h1>Welcome to the VUW Grade Calculator</h1>

            <div className="gradeCalculationUI">
                <div className="courseAndButton">
                    <input
                        type="text"
                        value={course}
                        onChange={e => setCourse(e.target.value)}
                        placeholder="Enter Course"
                        className="courseInput"
                    />
                    
                </div>
                <input
                    type="text"
                    value={grade}
                    onChange={e => setGrade(e.target.value)}
                    placeholder="Enter Grade"
                    className="gradeInput"
                />
                <button onClick={handleGradeCalculation} className="calculateBtn">
                    Calculate Grades - test
                </button>

            </div>
        </div>
    )
}

export default Home
