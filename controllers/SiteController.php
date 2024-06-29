<?php

namespace app\controllers;

use Yii;
use yii\filters\AccessControl;
use yii\web\Controller;
use yii\web\Response;
use yii\filters\VerbFilter;
use app\models\LoginForm;
use app\models\ContactForm;

class SiteController extends Controller
{
    /**
     * {@inheritdoc}
     */
    public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::class,
                'only' => ['logout'],
                'rules' => [
                    [
                        'actions' => ['logout'],
                        'allow' => true,
                        'roles' => ['@'],
                    ],
                ],
            ],
            'verbs' => [
                'class' => VerbFilter::class,
                'actions' => [
                    'logout' => ['post'],
                ],
            ],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function actions()
    {
        return [
            'error' => [
                'class' => 'yii\web\ErrorAction',
            ],
            'captcha' => [
                'class' => 'yii\captcha\CaptchaAction',
                'fixedVerifyCode' => YII_ENV_TEST ? 'testme' : null,
            ],
        ];
    }

    /**
     * Displays homepage.
     *
     * @return string
     */
    public function actionIndex()
    {
        return $this->render('index');
    }

    /**
     * Login action.
     *
     * @return Response|string
     */
    public function actionLogin()
    {
        if (!Yii::$app->user->isGuest) {
            return $this->goHome();
        }

        $model = new LoginForm();
        if ($model->load(Yii::$app->request->post()) && $model->login()) {
            return $this->goBack();
        }

        $model->password = '';
        return $this->render('login', [
            'model' => $model,
        ]);
    }

    /**
     * Logout action.
     *
     * @return Response
     */
    public function actionLogout()
    {
        Yii::$app->user->logout();

        return $this->goHome();
    }

    /**
     * Displays contact page.
     *
     * @return Response|string
     */
    public function actionContact()
    {
        $model = new ContactForm();
        if ($model->load(Yii::$app->request->post()) && $model->contact(Yii::$app->params['adminEmail'])) {
            Yii::$app->session->setFlash('contactFormSubmitted');

            return $this->refresh();
        }
        return $this->render('contact', [
            'model' => $model,
        ]);
    }

    /**
     * Displays about page.
     *
     * @return string
     */
    public function actionAbout()
    {
        return $this->render('about');
    }

    /**
     * This action saves the 'time_track_data' from POST request into a file
     * in the "runtime" folder
     */
    public function actionSaveTimeTrackData()
    {
        if (Yii::$app->request->isPost) {
            $rawData = Yii::$app->request->getRawBody();


            if (isset($rawData)) {
                $runtimePath = Yii::getAlias('@runtime');
                $filePath = $runtimePath . '/time_track_data.json';

                //Save data into the file
                file_put_contents($filePath, $rawData);

                // Set response format to JSON
                Yii::$app->response->format = Response::FORMAT_JSON;

                return ['message' => 'Data saved successfully.'];
            } else {
                throw new \yii\web\HttpException(400, "'time_track_data' is not set in the POST request.");
            }
        } else {
            throw new \yii\web\HttpException(405, "This action supports only POST request.");
        }
    }

    /**
     * This action reads the 'time_track_data.json' from the "runtime" folder
     * and returns its content
     */
    public function actionReadTimeTrackData()
    {
        $runtimePath = Yii::getAlias('@runtime');
        $filePath = $runtimePath . '/time_track_data.json';

        // Check if the file exists
        if (!file_exists($filePath)) {
            file_put_contents($filePath, json_encode([]));
        }

        // Get the file contents
        $data = file_get_contents($filePath);

        // Decode JSON data to PHP array
        $dataArray = json_decode($data, true);

        if (json_last_error() != JSON_ERROR_NONE) {
            throw new \yii\web\HttpException(500, "Invalid JSON data in 'time_track_data.json'.");
        }

        // Set response format to JSON
        Yii::$app->response->format = Response::FORMAT_JSON;

        // Return data
        return $dataArray['time_track_data'];
    }
}
