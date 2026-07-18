pipeline{
    agent any

    tools{
        jdk 'JAVA_21'
        maven 'MAVEN_3'
    }

    stages{
        stage('Backend: Building JAR File'){
            steps{
                echo 'Building Spring Boot Application :)'
                powershell '''
                    cd D:/Projects/E-Com/SpringEcom
                    mvn clean package -DskipTests'''
            }
        }

        stage('Docker Compose Stage'){
            steps{
                echo 'starting Docker compose file'
                powershell  '''
                    cd D:/Projects/E-Com
                    docker-compose up -d --build
                    Start-Job -ScriptBlock { docker-compose -f "D:/Projects/E-Com/docker-compose.yml" logs -f *>&1 >> "D:/Projects/E-Com/containers_runtime.logs" }
                '''
            }
        }
    }

    post{
        always{
            echo 'Pipeline execution finished'
        }
        success{
            echo 'Build and Deployment successful'
        }
        failure{
            echo 'Pipeline failed, check logs.'
        }
    }
}

// pipeline{
//     agent any
//
//     tools{
//         jdk 'JAVA_21'
//         maven 'MAVEN_3'
//     }
//
//     stages{
//         stage('Backend: Building JAR File'){
//             steps{
//                 echo 'Building Spring Boot Application :)'
//                 bat 'cd /d D:/Projects/E-Com/SpringEcom && mvn clean package -DskipTests'
//             }
//         }
//
//         stage('Docker Compose Stage'){
//             steps{
//                 echo 'starting Docker compose file'
//                 bat  '''
//                     cd /d D:/Projects/E-Com && docker-compose up -d --build
//                     Start-Job -ScriptBlock { docker-compose -f "D:/Projects/E-Com/docker-compose.yml" logs *>&1 >> "D:/Projects/E-Com/containers_runtime.logs"}
//                 '''
//             }
//         }
//
// //  start /b "" cmd /c "docker-compose logs -f > D:/Projects/E-Com/containers_runtime.log 2&>1"
// //  start /b "" cmd /c "docker-compose logs -f > D:\\Projects\\ecommerce-app\\containers_runtime.log 2>&1"
// // docker-compose ps
// //                     docker-compose logs --no-color
// //         stage('Backend Docker Deploy'){
// //             steps{
// //                 bat '''
// //                     cd /d D:/Projects/E-Com/SpringEcom
// //
// //                     docker stop e-com-backend 2>nul || rem
// //                     docker rm e-com-backend 2>nul || rem
// //
// //                     docker build -t e-com-backend:latest .
// //                     docker run -d --name e-com-backend -p 8081:8081 e-com-backend:latest
// //                 '''
// //             }
// //         }
//
// //         stage('Frontend: Install Dependencies'){
// //             steps{
// //                 echo 'Installing React Dependencies :)'
// //                 bat '''
// //                     cd /d D:/Projects/E-Com/Frontend
// //
// //                     docker stop e-com-frontend 2>nul || rem
// //                     docker rm e-com-frontend 2>nul || rem
// //
// //                     docker build -t e-com-frontend:latest .
// //                     docker run -d --name e-com-frontend -p 80:80 e-com-frontend:latest
// //                 '''
// //             }
// //         }
//     }
//
//     post{
//         always{
//             echo 'Pipeline execution finished'
//         }
//         success{
//             echo 'Build and Deployment successful'
//         }
//         failure{
//             echo 'Pipeline failed, check logs.'
//         }
//     }
// }