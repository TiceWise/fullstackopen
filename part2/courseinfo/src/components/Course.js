import React from 'react';

const Header = ({ course }) => {
    return (
      <h1>{course.name}</h1>
    )
  }
  
  const Total = ({ course }) => {
    const total = course.parts.reduce((sum, a) => {
      // console.log('sum', sum)
      // console.log('a', a.exercises)
      return sum + a.exercises}, 0)
      
    return(
      <p><b>total of {total} excercises</b></p>
    ) 
  }
  
  const Part = (props) => {
    return (
      <p>
        {props.part.name} {props.part.exercises}
      </p>    
    )
  }
  
  const Content = ({ course }) => {
    return (
      <div>
        {course.parts.map(parts => 
          <Part part={parts} key={parts.id}/>
        )}
      </div>
    )
  }
  
  const Course = ({ course }) => {
    return (
      <div>
        <Header course={course} />
        <Content course={course} />
        <Total course={course} />
      </div>
    )
  }

  export default Course