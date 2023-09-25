pipeline {
    options {
        buildDiscarder logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '14', numToKeepStr: '10')
        copyArtifactPermission '/Sysadmin/build_app, /Sysadmin/deploy_app_aws'
    }
    triggers {
        pollSCM 'H/15 * * * *'
    }
    agent any
    parameters {
        choice choices: ['', 'snd', 'dev', 'qa', 'prf', 'prd'], description: 'Build/Deploy ENV', name: 'BUILD_ENV'
    }
    environment {
        OS_GRP = 'customer'
        APP_NAME = 'storefront'
    }
    stages {
        stage('Run the build') {
            steps {
                script {
                    try {
                        env.COMMIT_TAG = "${env.BRANCH_NAME}"
                    }
                    catch (err) {
                        env.COMMIT_TAG = "${env.TAG_NAME}"
                    }
                    env.BUILD_ENV = "${params.BUILD_ENV}"

                    def build_job = build(job: '/Sysadmin/build_app', parameters: [
                                                              string(name: 'OS_GRP', value: "${env.OS_GRP}"),
                                                              string(name: 'COMMIT_TAG', value: "${env.COMMIT_TAG}"),
                                                              string(name: 'APP_NAME', value: "${env.APP_NAME}"),
                                                              string(name: 'Workspace_Home', value: "${WORKSPACE}"),
                                                              string(name: 'BUILD_ENV', value: "${env.BUILD_ENV}"),
                                                             ])
                    try {
                        env.BUILD_USER = "${build_job.getBuildVariables().build_user}"
                        env.PROCEED_TO_DEPLOY = "${build_job.getBuildVariables().PROCEED_TO_DEPLOY}"
                        env.build_job_number = "${build_job.number}"
                        env.BUILD_ENV = "${build_job.getBuildVariables().BUILD_ENV}"
                    }
                    catch (error) {
                        currentBuild.result = 'UNSTABLE'
                        env.PROCEED_TO_DEPLOY = 2 //No build actually happened
                    }
                }
            }
        }
        stage('Deploy the build') {
            when {
                allOf {
                    expression { env.PROCEED_TO_DEPLOY.toInteger() == 1 }
                    anyOf {
                        expression { env.BUILD_ENV == 'snd' }
                        expression { env.BUILD_ENV == 'dev' }
                        expression { env.BUILD_ENV == 'qa' }
                        expression { env.BUILD_ENV == 'prf' }
                        expression { env.BUILD_ENV == 'prd' }
                    }
                }
            }
            steps {
                script {
                    def deploy_job = build(job: '/Sysadmin/deploy_app_aws', parameters: [
                                                      string(name: 'DEPLOY_ENV', value: "${env.BUILD_ENV}"),
                                                      string(name: 'OS_GRP', value: "${env.OS_GRP}"),
                                                      string(name: 'COMMIT_TAG', value: "${env.COMMIT_TAG}"),
                                                      string(name: 'APP_NAME', value: "${env.APP_NAME}"),
                                                      string(name: 'Workspace_Home', value: "${WORKSPACE}"),
                                                      string(name: 'BUILD_USER', value: "${env.BUILD_USER}")
                                                     ])
                    env.PROMO_DATE = "${deploy_job.getBuildVariables().PROMO_DATE}"
                    env.deploy_job_number = "${deploy_job.number}"
                    env.PROCEED_TO_SYNC = "${deploy_job.getBuildVariables().PROCEED_TO_SYNC}"
                    try {
                        copyArtifacts filter: "deploy_logs.log", fingerprintArtifacts: true, projectName: '/Sysadmin/deploy_app_aws', selector: specific("${env.deploy_job_number}")
                    } catch (Exception e) {
                        echo 'failed to get deploy log'
                    }
                }
                
            }
        }
        stage('Sync static assets') {
            when {
                allOf {
                    expression { env.PROCEED_TO_SYNC.toInteger() == 1 }
                    anyOf {
                        expression { env.BUILD_ENV == 'dev' }
                        expression { env.BUILD_ENV == 'qa' }
                        expression { env.BUILD_ENV == 'prf' }
                        expression { env.BUILD_ENV == 'prd' }
                    }
                }
            }
            steps {
                script {
                    def sync_job = build(job: '/Sysadmin/storefront_asset_sync', parameters: [
                                                      string(name: 'DEPLOY_ENV', value: "${env.BUILD_ENV}"),
                                                      string(name: 'PROMO_DATE', value: "${env.PROMO_DATE}"),
                                                      string(name: 'BUILD_USER', value: "${env.BUILD_USER}")
                                                     ])
                }
                
            }
        }
        stage('Cleanup the build') {
            when {
                expression { env.PROCEED_TO_DEPLOY.toInteger() != 2 }
            }
            steps {
                build(job: '/Sysadmin/cleanup_build', parameters: [
                                                      string(name: 'APP_NAME', value: "${env.APP_NAME}"),
                                                      string(name: 'Workspace_Home', value: "${WORKSPACE}"),
                                                     ])
                script {
                    if ( "${env.PROCEED_TO_DEPLOY}".toInteger() == 0 ) {
                        currentBuild.result = 'FAILURE'
                    }
                }
            }
        }
    }
    post {
        success{
            emailext body: "View output of Build: ${BUILD_URL}", subject: "BUILD: SUCCEEDED Job Name: ${JOB_NAME} (${BRANCH_NAME})", to: 'dg_nextgen_FE_developers@hobbylobby.com'
        }
        failure{
            emailext attachmentsPattern: '**/*.log', body: 'View output of Build: ${BUILD_URL}', subject: 'BUILD: FAILED Job Name: ${JOB_NAME} (${BRANCH_NAME})', to: 'dg_nextgen_FE_developers@hobbylobby.com'
        }
        always {
            script{
                try {
                    echo "${env.build_job_number}"
                    copyArtifacts filter: "*.log", fingerprintArtifacts: true, projectName: '/Sysadmin/build_app', selector: specific("${env.build_job_number}")
                    archiveArtifacts artifacts: '*.log', fingerprint: true
                } catch (Exception e) {
                    echo 'no files to archive'
                }
            }
        }
        cleanup {
            cleanWs()
        }
    }
}