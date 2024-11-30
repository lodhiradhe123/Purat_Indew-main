<?php

// use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\AgentController;
use App\Http\Controllers\GraphController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\GoogleController;
use App\Http\Controllers\CreditsController;
use App\Http\Controllers\EmailOTPController;
use App\Http\Controllers\TemplateController;
use App\Http\Controllers\BroadcastController;
use App\Http\Controllers\MobileOTPController;
use App\Http\Controllers\ChatMessageController;
use App\Http\Controllers\SupportTicketController;
use App\Http\Controllers\FundController;
use App\Http\Controllers\CRMController;

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FileManagerController;
use App\Http\Controllers\UrlShortnerController;
use App\Http\Controllers\ChatInboxTagController;
use App\Http\Controllers\InvoiceController;
use App\Events\MessageSent;


use App\Http\Controllers\MessageController;

use App\Http\Controllers\ExternalApiController;


use App\Http\Controllers\VoiceController;





 use Illuminate\Support\Facades\Broadcast;

use App\Http\Controllers\ChatController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and will be assigned to
| the "api" middleware group. Enjoy building your API!
|
*/

/*
|--------------------------------------------------------------------------
| AUTH created at 28-6-2024
|--------------------------------------------------------------------------
*/

Route::post('/registration', [AuthController::class, 'registration']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

/*
|--------------------------------------------------------------------------
| Broadcast created at 28-6-2024
|--------------------------------------------------------------------------
*/


    Route::post('/insert-broadcast-data', [BroadcastController::class, 'store']); //inserting broadcast data into Mob_no3 and Campaign_details


    // group api
    Route::post('/group-names', [GroupController::class, 'groupName']);
    Route::post('/group-data', [GroupController::class, 'groupData']);
    Route::post('/broadcast', [BroadcastController::class, 'handleBroadcast']); //Broadcast_Read
    Route::get('/chart-data', [GraphController::class, 'getCountByTimeFrame']);

    /*
|--------------------------------------------------------------------------
| Template created at 28-6-2024
|--------------------------------------------------------------------------
*/

// This route will respond to GET requests

    /*
|--------------------------------------------------------------------------
| Graphs created at 28-6-2024
|--------------------------------------------------------------------------
*/
    Route::post('/mobile-numbers/count', [GraphController::class, 'getCountByTimeFrame']);

    /*
|--------------------------------------------------------------------------
| Chat-Inbox
|--------------------------------------------------------------------------
*/
    //create(09-07-2024)
    Route::post('advance-filtered-data', [ChatMessageController::class, 'getAdvanceFilteredData']); //fetching data with advance filter (status, attribute, assignee)
    Route::post('filtered-data', [ChatMessageController::class, 'getFilteredData']); //fetching data with filter (open,expired,active.broadcast etc)
    Route::post('chat-messages', [ChatMessageController::class, 'fetchMessages']); //updated_at(25-07-2024)
    Route::post('chat-message-room/update', [ChatMessageController::class, 'updateColumn']);
    //created_at(25-07-2024)
    Route::post('/quick-replies', [ChatMessageController::class, 'handleQuickReplies']);
    //created_at(26-07-2024)
    Route::post('/chat-inbox/note', [ChatMessageController::class, 'handleNote']);

    /*
|--------------------------------------------------------------------------
| Management User
|--------------------------------------------------------------------------
*/
    Route::post('/assign-users', [AgentController::class, 'handleAssignUsers']); //create_at(17-07-24)
    Route::post('/teams', [TeamController::class, 'handleTeams']); //create_at(19-07-24)

    /*
|--------------------------------------------------------------------------
| Dhashboard
|--------------------------------------------------------------------------
*/
   //CRM created_at(02-08-2024)
    Route::post('/crm/all-chat', [CRMController::class, 'handleAllData']);
    Route::post('/crm/specific-chat', [CRMController::class, 'handleSpecificData']);

	Route::post('/broadcast/specific', [BroadcastController::class, 'broadcastSpecific']);
	//create_at(26-07-24)
	Route::post('/template', [TemplateController::class, 'handleTemplate']);

	//created_at(29-07-2024)
	Route::get('/broadcast/all-data', [BroadcastController::class, 'allBroadcastData']);

	Route::post('/support-tickets', [SupportTicketController::class, 'handleRequest']);
	Route::post('/user/update', [AuthController::class, 'update']);


	//url API created_at(09-08-2024)
	Route::post('/fund', [FundController::class, 'handleFund']);

	// added by rahul1011
	Route::post('/profile', [ProfileController::class, 'handleProfile']);//created_at(31-07-24)
	Route::post('/file-managers', [FileManagerController::class, 'handleFileManager']);//created_at(01-08-24)
	Route::post('/chat-inbox/tag', [ChatInboxTagController::class, 'handleCrud']);//tag API created_at(10-08-2024)


	Route::post('/crm_broadcast', [CRMController::class, 'crm_broadcast']);//crm_broadcast created_at(29-08-2024)

	
	Route::post('/invoice', [InvoiceController::class, 'handleInvoice']);//invoice API created_at(15-08-2024) //updated_at (30-08-2024)
	Route::post('/invoice-user', [InvoiceController::class, 'handleUser']);//invoice API created_at(30-08-2024)
	Route::post('/invoice-company', [InvoiceController::class, 'handleCompany']);//invoice API created_at(30-08-2024)
	Route::post('/services', [ServiceController::class, 'handleServices']);//created_at 04-09-2024

	Route::post('chatbot-flow', [ChatbotController::class, 'handleRequest']);//invoice API created_at(28-08-2024)//udated_at(2-9-24)
	Route::post('chatbot-step', [ChatbotController::class, 'handleStepRequest']);//invoice API created_at(28-08-2024)//udated_at(2-9-24)

});

//email-otp api
Route::post('/send-email-otp', [EmailOTPController::class, 'sendEmailOTP']);
Route::post('/verify-email-otp', [EmailOTPController::class, 'verifyEmailOTP']);
Route::post('/update-password', [EmailOTPController::class, 'update']);

//number-otp api for verified number
Route::post('/send-mobile-otp', [MobileOTPController::class, 'sendMobileOTP']);
Route::post('/verify-mobile-otp', [MobileOTPController::class, 'verifyMobileOTP']);


// google login
Route::get('login/google', [GoogleController::class, 'redirectToGoogle']);
Route::get('login/google/callback', [GoogleController::class, 'handleGoogleCallback']);

// Postman
Route::post('/credits', [CreditsController::class, 'handleRequest']); //create_at(22-07-24)



Route::post('/url-shortners', [UrlShortnerController::class, 'handleUrlShortners']);//url API created_at(06-08-2024)


Route::post('/send-message', function () {
    $message = 'Hello, this is a test message!';
    broadcast(new MessageSent($message))->toOthers();
    return 'Message sent!';
});


Route::get('/messages', [ChatController::class, 'getMessages']);
Route::post('/webhook-api', [ChatController::class, 'sendMessage']);

// Route::post('/webhook-api', [ExternalApiController::class, 'storeData']);

// Route::get('/broadcast', function () {
//     event(new \App\Events\TestEvent());
//     return 'Event has been broadcast!';
// });

Route::post('/get-delivery-data', [VoiceController::class, 'getDeliveryDataByUsername']);