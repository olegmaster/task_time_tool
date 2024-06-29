<?php

/** @var yii\web\View $this */

$this->title = 'My Yii Application';
?>
<div class="container mt-5">
    <h1 class="text-center">Time Tracker</h1>
    <div class="row justify-content-center">
        <div class="col-md-6">
            <form id="taskForm">
                <div class="form-group">
                    <label for="taskInput">Task Description</label>
                    <input type="text" class="form-control" id="taskInput" placeholder="Enter task description">
                </div>
                <div class="form-group">
                    <label for="categoryInput">Task Category</label>
                    <input type="text" class="form-control" id="categoryInput" placeholder="Enter task category">
                </div>
                <button type="button" class="btn btn-primary btn-block" id="toggleTimerBtn">Start Timer</button>
            </form>
            <div class="text-center mt-3">
                <div id="timerDisplay" class="h3">00:00:00</div>
            </div>
        </div>
    </div>
    <div class="row mt-5">
        <div class="col">
            <h2>Time Entries</h2>
            <ul class="list-group" id="entriesList"></ul>
        </div>
    </div>
</div>

<script src="/js/app.js"></script>
