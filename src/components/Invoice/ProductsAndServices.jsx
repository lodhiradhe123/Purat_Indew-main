// import React, { useState, useEffect } from 'react';

// const ProductsAndServices = ({ description,items, setItems, discount, setDiscount }) => {
//   const [subtotal, setSubtotal] = useState(0);
//   const [totalCGST, setTotalCGST] = useState(0);
//   const [totalSGST, setTotalSGST] = useState(0);
//   const [total, setTotal] = useState(0);

//   // Handler to add a new item
//   const handleAddItem = () => {
//     setItems((prevItems) => [
//       ...prevItems,
//       { description: "", quantity: 1, price: 0, cgst: 0, sgst: 0, total: 0 }
//     ]);
//   };

//   // Handler to remove an item
//   const handleRemoveItem = (index) => {
//     setItems((prevItems) => {
//       const newItems = [...prevItems];
//       newItems.splice(index, 1);
//       return newItems.length === 0
//         ? [{ description: "", quantity: 1, price: 0, cgst: 0, sgst: 0, total: 0 }]
//         : newItems;
//     });
//   };

//   // Handler to change item details
//   const handleItemChange = (index, event) => {
//     const { name, value } = event.target;
//     setItems((prevItems) => {
//       const newItems = [...prevItems];
//       newItems[index][name] = value;
//       newItems[index].total =
//         (newItems[index].quantity * newItems[index].price) * (1 + (newItems[index].cgst + newItems[index].sgst) / 100);
//       return newItems;
//     });
//   };

//   // Function to calculate totals
//   const calculateTotals = () => {
//     let newSubtotal = 0;
//     let newTotalCGST = 0;
//     let newTotalSGST = 0;

//     items.forEach(item => {
//       newSubtotal += item.quantity * item.price;
//       newTotalCGST += (item.quantity * item.price) * (item.cgst / 100);
//       newTotalSGST += (item.quantity * item.price) * (item.sgst / 100);
//     });

//     const finalTotal = newSubtotal + newTotalCGST + newTotalSGST - discount;
//     setSubtotal(newSubtotal);
//     setTotalCGST(newTotalCGST);
//     setTotalSGST(newTotalSGST);
//     setTotal(finalTotal);
//   };

//   // Effect to recalculate totals whenever items or discount change
//   useEffect(() => {
//     calculateTotals();
//   }, [items, discount]);

//   useEffect(() => {
//     if (items && items.length > 0) {
//         setItems(items); // Set initial products/services data
//     }
// }, [items, setItems]);

//   return (
//     <div>
//       <h3 className="text-lg font-medium mb-3">Products/Services</h3>
//       <table className="min-w-full bg-white mb-4">
//         <thead>
//           <tr>
//             <th className="py-2 px-4 border-b text-left">Action</th>
//             <th className="py-2 px-4 border-b text-left">Products</th>
//             <th className="py-2 px-4 border-b text-left">Quantity</th>
//             <th className="py-2 px-4 border-b text-left">Price</th>
//             <th className="py-2 px-4 border-b text-left">CGST (%)</th>
//             <th className="py-2 px-4 border-b text-left">SGST (%)</th>
//             <th className="py-2 px-4 border-b text-left">Total</th>
//           </tr>
//         </thead>
//         <tbody>
//           {items.map((item, index) => (
//             <tr key={index}>
//               <td className="py-2 px-4 border-b flex items-center">
//                 <button
//                   className="bg-blue-500 text-white py-1 px-2 rounded text-sm mr-2"
//                   onClick={handleAddItem}
//                 >
//                   +
//                 </button>
//                 <button
//                   className="bg-red-500 text-white py-1 px-2 rounded text-sm"
//                   onClick={() => handleRemoveItem(index)}
//                 >
//                   &#x2715;
//                 </button>
//               </td>
//               <td className="py-2 px-4 border-b">
//                 <input
//                   type="text"
//                   name="description"
//                   value={item.description}
//                   onChange={(e) => handleItemChange(index, "description", e.target.value)}
//                   className="p-1 block w-full border rounded text-sm"
//                   placeholder="Description"
//                 />
//               </td>
//               <td className="py-2 px-4 border-b">
//                 <input
//                   type="number"
//                   name="quantity"
//                   value={item.quantity}
//                   onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
//                   className="p-1 block w-full border rounded text-sm"
//                 />
//               </td>
//               <td className="py-2 px-4 border-b">
//                 <input
//                   type="number"
//                   name="price"
//                   value={item.price}
//                   onChange={(e) => handleItemChange(index, "price", e.target.value)}
//                   className="p-1 block w-full border rounded text-sm"
//                 />
//               </td>
//               <td className="py-2 px-4 border-b">
//                 <input
//                   type="number"
//                   name="cgst"
//                   value={item.cgst}
//                   onChange={(e) => handleItemChange(index, "cgst", e.target.value)}
//                   className="p-1 block w-full border rounded text-sm"
//                 />
//               </td>
//               <td className="py-2 px-4 border-b">
//                 <input
//                   type="number"
//                   name="sgst"
//                   value={item.sgst}
//                   onChange={(e) => handleItemChange(index, "sgst", e.target.value)}
//                   className="p-1 block w-full border rounded text-sm"
//                 />
//               </td>
//               <td className="py-2 px-4 border-b">
//                 <input
//                   type="number"
//                   name="total"
//                   value={(item.total || 0).toFixed(2)}  // Ensure total is a valid number
//                   readOnly
//                   className="p-1 block w-full border rounded text-sm bg-gray-100"
//                 />
//               </td>
//               <td>{(item.quantity * item.price).toFixed(2)}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <div className="text-center mb-4">
//         <button
//           onClick={handleAddItem}
//           className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
//         >
//           Add New Item
//         </button>
//       </div>

//       {/* Totals Section */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div></div> {/* Empty grid column for layout alignment */}
//         <div className="space-y-2">
//           <div className="flex justify-between">
//             <span>Sub Total:</span>
//             <span>{subtotal.toFixed(2)}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>CGST:</span>
//             <span>{totalCGST.toFixed(2)}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>SGST:</span>
//             <span>{totalSGST.toFixed(2)}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Discount:</span>
//             <input
//               type="number"
//               value={discount}
//               onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
//               className="p-1 w-24 text-right border rounded text-sm"
//             />
//           </div>
//           <div className="flex justify-between font-semibold">
//             <span>Total:</span>
//             <span>{total.toFixed(2)}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductsAndServices;

// import React, { useState, useEffect } from 'react';

// const ProductsAndServices = ({ items, setItems, discount, setDiscount }) => {
//   const [subtotal, setSubtotal] = useState(0);
//   const [totalCGST, setTotalCGST] = useState(0);
//   const [totalSGST, setTotalSGST] = useState(0);
//   const [totalIGST, setTotalIGST] = useState(0);
//   const [total, setTotal] = useState(0);

//   // Handler to add a new item
//   const handleAddItem = () => {
//     setItems((prevItems) => [
//       ...prevItems,
//       { products: "", quantity: 1, price: 0, cgst: 0, sgst: 0, total: 0 }
//     ]);
//   };

//   // Handler to remove an item
//   const handleRemoveItem = (index) => {
//     setItems((prevItems) => {
//       const newItems = [...prevItems];
//       newItems.splice(index, 1);
//       return newItems.length === 0
//         ? [{ products: "", quantity: 1, price: 0, cgst: 0, sgst: 0, total: 0 }]
//         : newItems;
//     });
//   };

//   // Handler to change item details
//   const handleItemChange = (index, event) => {
//     const { name, value } = event.target;
//     setItems((prevItems) => {
//       const newItems = [...prevItems];
//       newItems[index][name] = value;
//       newItems[index].total =
//         (newItems[index].quantity * newItems[index].price) * (1 + (newItems[index].cgst + newItems[index].sgst + newItems[index].igst) / 100);
//       return newItems;
//     });
//   };

//   // Function to calculate totals
//   const calculateTotals = () => {
//     let newSubtotal = 0;
//     let newTotalCGST = 0;
//     let newTotalSGST = 0;
//     let newTotalIGST = 0;

//     items.forEach(item => {
//       newSubtotal += item.quantity * item.price;
//       newTotalCGST += (item.quantity * item.price) * (item.cgst / 100);
//       newTotalSGST += (item.quantity * item.price) * (item.sgst / 100);
//       newTotalIGST += (item.quantity * item.price) * (item.igst / 100);
//     });

//     const finalTotal = newSubtotal + newTotalCGST + newTotalSGST - discount;
//     setSubtotal(newSubtotal);
//     setTotalCGST(newTotalCGST);
//     setTotalSGST(newTotalSGST);
//     setTotal(finalTotal);
//   };

//   // Effect to recalculate totals whenever items or discount change
//   useEffect(() => {
//     calculateTotals();
//   }, [items, discount]);

//   return (
//     <div>
//       <h3 className="text-lg font-medium mb-3">Products/Services</h3>
//       <table className="min-w-full bg-white mb-4">
//         <thead>
//           <tr>
//             <th className="py-2 px-4 border-b text-left">Action</th>
//             <th className="py-2 px-4 border-b text-left">Products</th>
//             <th className="py-2 px-4 border-b text-left">Quantity</th>
//             <th className="py-2 px-4 border-b text-left">Price</th>
//             <th className="py-2 px-4 border-b text-left">CGST (%)</th>
//             <th className="py-2 px-4 border-b text-left">SGST (%)</th>
//             <th className="py-2 px-4 border-b text-left">IGST (%)</th>
//             <th className="py-2 px-4 border-b text-left">Total</th>
//           </tr>
//         </thead>
//         <tbody>
//           {items.map((item, index) => (
//             <tr key={index}>
//               <td className="py-2 px-4 border-b flex items-center">
//                 <button
//                   className="bg-blue-500 text-white py-1 px-2 rounded text-sm mr-2"
//                   onClick={handleAddItem}
//                 >
//                   +
//                 </button>
//                 <button
//                   className="bg-red-500 text-white py-1 px-2 rounded text-sm"
//                   onClick={() => handleRemoveItem(index)}
//                 >
//                   &#x2715;
//                 </button>
//               </td>
//               <td className="py-2 px-4 border-b">
//                 <input
//                   type="text"
//                   name="products"
//                   value={item.products}
//                   onChange={(e) => handleItemChange(index, e)}
//                   className="p-1 block w-full border rounded text-sm"
//                   placeholder="Product Name"
//                 />
//               </td>
//               <td className="py-2 px-4 border-b">
//                 <input
//                   type="number"
//                   name="quantity"
//                   value={item.quantity}
//                   onChange={(e) => handleItemChange(index, e)}
//                   className="p-1 block w-full border rounded text-sm"
//                 />
//               </td>
//               <td className="py-2 px-4 border-b">
//                 <input
//                   type="number"
//                   name="price"
//                   value={item.price}
//                   onChange={(e) => handleItemChange(index, e)}
//                   className="p-1 block w-full border rounded text-sm"
//                 />
//               </td>
//               <td className="py-2 px-4 border-b">
//                 <input
//                   type="number"
//                   name="cgst"
//                   value={item.cgst}
//                   onChange={(e) => handleItemChange(index, e)}
//                   className="p-1 block w-full border rounded text-sm"
//                 />
//               </td>
//               <td className="py-2 px-4 border-b">
//                 <input
//                   type="number"
//                   name="sgst"
//                   value={item.sgst}
//                   onChange={(e) => handleItemChange(index, e)}
//                   className="p-1 block w-full border rounded text-sm"
//                 />
//               </td>
//               <td className="py-2 px-4 border-b">
//                 <input
//                   type="number"
//                   name="igst"
//                   value={item.sgst}
//                   onChange={(e) => handleItemChange(index, e)}
//                   className="p-1 block w-full border rounded text-sm"
//                 />
//               </td>
//               <td className="py-2 px-4 border-b">
//                 <input
//                   type="number"
//                   name="total"
//                   value={(item.total || 0).toFixed(2)}
//                   readOnly
//                   className="p-1 block w-full border rounded text-sm bg-gray-100"
//                 />
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <div className="text-center mb-4">
//         <button
//           onClick={handleAddItem}
//           className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
//         >
//           Add New Item
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProductsAndServices;

import React, { useState, useEffect } from "react";

const ProductsAndServices = ({ products, items, setItems, discount, setDiscount }) => {
    const [subtotal, setSubtotal] = useState(0);
    const [totalCGST, setTotalCGST] = useState(0);
    const [totalSGST, setTotalSGST] = useState(0);
    const [totalIGST, setTotalIGST] = useState(0);
    const [totalTax, setTotalTax] = useState(0); // For total tax calculation
    const [total, setTotal] = useState(0);

    // Handler to add a new item
    const handleAddItem = () => {
        setItems((prevItems) => [
            ...prevItems,
            {
                products: "",
                quantity: "",
                price: 0,
                cgst: 0,
                sgst: 0,
                igst: 0,
                total: 0,
            },
        ]);
    };

    // Handler to remove an item
    const handleRemoveItem = (index) => {
        setItems((prevItems) => {
            const newItems = [...prevItems];
            newItems.splice(index, 1);
            return newItems.length === 0
                ? [
                      {
                          products: "",
                          quantity: 1,
                          price: 0,
                          cgst: 0,
                          sgst: 0,
                          igst: 0,
                          total: 0,
                      },
                  ]
                : newItems;
        });
    };

    // Handler to change item details
    // const handleItemChange = (index, event) => {
    //     const { name, value } = event.target;
    //     setItems((prevItems) => {
    //         const newItems = [...prevItems];
    //         newItems[index][name] = value;
    //         newItems[index].total =
    //             newItems[index].quantity *
    //             newItems[index].price *
    //             (1 +
    //                 (newItems[index].cgst +
    //                     newItems[index].sgst +
    //                     newItems[index].igst) /
    //                     100);
    //         return newItems;
    //     });
    // };

    const handleItemChange = (index, event) => {
        const { name, value } = event.target;
        setItems((prevItems) => {
            const newItems = [...prevItems];
            newItems[index][name] = name === 'quantity' || name === 'price' || name === 'cgst' || name === 'sgst' || name === 'igst' 
                ? parseFloat(value) 
                : value;
            newItems[index].total = newItems[index].quantity * newItems[index].price * 
                (1 + (newItems[index].cgst + newItems[index].sgst + newItems[index].igst) / 100);
            return newItems;
        });
    };
    

    // Function to calculate totals
    const calculateTotals = () => {
        let newSubtotal = 0;
        let newTotalCGST = 0;
        let newTotalSGST = 0;
        let newTotalIGST = 0;

        items.forEach((item) => {
            newSubtotal += item.quantity * item.price;
            newTotalCGST += item.quantity * item.price * (item.cgst / 100);
            newTotalSGST += item.quantity * item.price * (item.sgst / 100);
            newTotalIGST += item.quantity * item.price * (item.igst / 100);
        });

        const totalTaxAmount = newTotalCGST + newTotalSGST + newTotalIGST;
        const finalTotal = newSubtotal + totalTaxAmount - discount;

        setSubtotal(newSubtotal);
        setTotalCGST(newTotalCGST);
        setTotalSGST(newTotalSGST);
        setTotalIGST(newTotalIGST);
        setTotalTax(totalTaxAmount);
        setTotal(finalTotal > 0 ? finalTotal : 0); // Ensure total doesn't go below zero
    };

    // Effect to recalculate totals whenever items or discount change
    useEffect(() => {
        calculateTotals();
    }, [items, discount]);

    return (
        <div>
            <h3 className="text-lg font-medium mb-3">Products/Services</h3>
            <table className="min-w-full bg-white mb-4">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b text-left">Action</th>
                        <th className="py-2 px-4 border-b text-left">
                            Products
                        </th>
                        <th className="py-2 px-4 border-b text-left">
                            Quantity
                        </th>
                        <th className="py-2 px-4 border-b text-left">Price</th>
                        <th className="py-2 px-4 border-b text-left">
                            CGST (%)
                        </th>
                        <th className="py-2 px-4 border-b text-left">
                            SGST (%)
                        </th>
                        <th className="py-2 px-4 border-b text-left">
                            IGST (%)
                        </th>
                        <th className="py-2 px-4 border-b text-left">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={index}>
                            <td className="py-2 px-4 border-b flex items-center">
                                <button
                                    className="bg-blue-500 text-white py-1 px-2 rounded text-sm mr-2"
                                    onClick={handleAddItem}
                                >
                                    +
                                </button>
                                <button
                                    className="bg-red-500 text-white py-1 px-2 rounded text-sm"
                                    onClick={() => handleRemoveItem(index)}
                                >
                                    &#x2715;
                                </button>
                            </td>
                            <td className="py-2 px-4 border-b">
                                <input
                                    type="text"
                                    name="products"
                                    value={item.products}
                                    onChange={(e) => handleItemChange(index, e)}
                                    className="p-1 block w-full border rounded text-sm"
                                    placeholder="Product Name"
                                />
                            </td>
                            <td className="py-2 px-4 border-b">
                                <input
                                    type="number"
                                    name="quantity"
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange(index, e)}
                                    className="p-1 block w-full border rounded text-sm"
                                />
                            </td>
                            <td className="py-2 px-4 border-b">
                                <input
                                    type="number"
                                    name="price"
                                    value={item.price}
                                    onChange={(e) => handleItemChange(index, e)}
                                    className="p-1 block w-full border rounded text-sm"
                                />
                            </td>
                            <td className="py-2 px-4 border-b">
                                <input
                                    type="number"
                                    name="cgst"
                                    value={item.cgst}
                                    onChange={(e) => handleItemChange(index, e)}
                                    className="p-1 block w-full border rounded text-sm"
                                />
                            </td>
                            <td className="py-2 px-4 border-b">
                                <input
                                    type="number"
                                    name="sgst"
                                    value={item.sgst}
                                    onChange={(e) => handleItemChange(index, e)}
                                    className="p-1 block w-full border rounded text-sm"
                                />
                            </td>
                            <td className="py-2 px-4 border-b">
                                <input
                                    type="number"
                                    name="igst"
                                    value={item.igst}
                                    onChange={(e) => handleItemChange(index, e)}
                                    className="p-1 block w-full border rounded text-sm"
                                />
                            </td>
                            <td className="py-2 px-4 border-b">
                                <input
                                    type="number"
                                    name="total"
                                    value={(item.total || 0).toFixed(2)}
                                    readOnly
                                    className="p-1 block w-full border rounded text-sm bg-gray-100"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* <div className="mb-4">
                <label className="block mb-1">Discount:</label>
                <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="p-1 border rounded text-sm"
                />
            </div> */}

            <div className="text-right">
                <p>Sub Total: {subtotal.toFixed(2)}</p>
                <p>Tax: {totalTax.toFixed(2)}</p>

                {/* Input for discount */}
                <div className="flex justify-end items-center">
                    <label className="mr-2">Discount: </label>
                    <input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(Number(e.target.value))} // Updates discount on change
                        className="p-1 border rounded text-sm text-right w-20"
                    />
                </div>

                {/* Total after applying discount */}
                <p>Total: {total.toFixed(2)}</p>
            </div>

            <div className="text-center mb-4">
                <button
                    onClick={handleAddItem}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                >
                    Add New Item
                </button>
            </div>
        </div>
    );
};

export default ProductsAndServices;
