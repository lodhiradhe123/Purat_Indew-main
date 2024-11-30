<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use App\Models\Language;

class MetaTemplateController extends Controller
{

private function mapCategory($categoryId)
{
    $categories = [
        1 => 'marketing',
        2 => 'utility',
        3 => 'authentication'
    ];

    return $categories[$categoryId] ?? 'marketing'; // Default to 'marketing' if no match is found
}


   private function getLanguageShortCode($languageId)
{
    // Fetch the language from the database based on the ID
    $language = Language::find($languageId);

    // If found, return the short_name; otherwise, default to 'en_US'
    return $language ? $language->short_name : 'en_US';
}

    public function convertAndSendToMeta(array $data)
    {
        // Log incoming data
        Log::channel('meta_template')->info('Incoming Data to MetaTemplateController', [
            'timestamp' => Carbon::now(),
            'incoming_data' => $data
        ]);

        // Perform the conversion from the original data to the Meta format
        $transformedData = $this->transformData($data);

        // Log transformed data before sending to Meta API
        Log::channel('meta_template')->info('Transformed Data to be sent to Meta API', [
            'timestamp' => Carbon::now(),
            'transformed_data' => $transformedData
        ]);

        // Send the transformed data to Meta (Facebook) using Guzzle
        $url = 'https://graph.facebook.com/v20.0/354084661114875/message_templates';
        $bearerToken = 'EAAc73vENBG8BO8xJ8lqBG7mgLPybSbljODAyxanjQbgrsyyXGENkDvVu94RzPNMlofThZBZACD5SMSDqmtXBKkktDrFojR5ZBCddIOaSRpZC3Q9LDMKvUYZC6cqaeG9ZCXl2iTwmnBZBv7b6IfTbh0CNGR3L0lZB2jk29XAFBbDUsNpiz2fpYqvZBWYTJZBrZARJ2cR';

        $client = new Client();

    try {
    $response = $client->request('POST', $url, [
        'headers' => [
            'Authorization' => 'Bearer ' . $bearerToken,
            'Content-Type' => 'application/json',
        ],
        'json' => $transformedData
    ]);

    // Check if the response is JSON
    if ($response->getHeader('Content-Type')[0] === 'application/json') {
        $responseData = json_decode($response->getBody(), true);
    } else {
        $responseData = (string) $response->getBody(); // Fallback for non-JSON responses
    }

    Log::channel('meta_template')->info('Response from Meta API', [
        'timestamp' => Carbon::now(),
        'response' => $responseData
    ]);

    return $responseData;
}
catch (\Exception $e) {
    Log::channel('meta_template')->error('Error sending to Meta API', [
        'timestamp' => Carbon::now(),
        'error_message' => $e->getMessage(),
        'status_code' => method_exists($e, 'getCode') ? $e->getCode() : 'N/A', // Status code, if available
        'stack_trace' => $e->getTraceAsString(), // Stack trace to debug the error source
        'transformed_data' => $transformedData // Log the request payload
    ]);

    return [
        'status' => 'error',
        'message' => $e->getMessage()
    ];
}

    }

private function transformData($data)
{
    // Fetch the language short code using the language ID from the database
    $languageShortCode = $this->getLanguageShortCode($data['language']);
    
    return [
        'name' => $data['template_name'],
        'language' => $languageShortCode, // Use the fetched language short code here
        'category' => $this->mapCategory($data['category']), // Map your category
        'components' => [
            [
                'type' => 'body',
                'text' => $data['template_body'], // No example key for body
            ],
            [
                'type' => 'carousel',
                'cards' => array_map(function ($carousel) {
                    return [
                        'components' => [
                            [
                                'type' => 'header',
                                'format' => strtolower($carousel['media']),
                                'example' => [
                                    'header_handle' => [
                                        "4:dGVzdC5qcGc=:aW1hZ2UvanBlZw==:ARZtIjUycvsOJ7wLx2ngLP0GRuXbzBaIY-SKgMM71B3G1cDOyEcSnXSWluFkFWJQb0C6CcKEkbCFyZsaSrivMbXKivbuDSVQYzAo8m2KGeGKFw:e:1727692903:2036153549915247:100087550691425:ARZ3DUfO2YM6DbHGBhQ"
                                    ]
                                ]
                            ],
                            [
                                'type' => 'body',
                                'text' => $carousel['body'] ?? '' // Ensure body is not null
                            ],
                            [
                                'type' => 'buttons',
                                'buttons' => array_map(function ($button) {
                                    return [
                                        'type' => strtolower($button['type']),  // Lowercase button type
                                        'text' => $button['text'],              // Button text
                                        'url' => isset($button['url']) ? $button['url'] : null, // Optional URL for URL type buttons
                                        'example' => isset($button['example']) ? $button['example'] : null // Optional example for URL type buttons
                                    ];
                                }, $carousel['buttons'])
                            ]
                        ]
                    ];
                }, $data['carousels'])
            ]
        ]
    ];
}}