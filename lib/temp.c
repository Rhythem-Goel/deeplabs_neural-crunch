#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct Node
{
    int key;
    char codename[31];
    struct Node *left;
    struct Node *right;
};

struct Node *createNode(int key, char name[])
{
    struct Node *newNode = malloc(sizeof(struct Node));
    if (newNode == NULL)
        exit(1);
    newNode->key = key;
    strcpy(newNode->codename, name);
    newNode->left = NULL;
    newNode->right = NULL;
    return newNode;
}

struct Node *insert(struct Node *root, int key, char name[])
{
    if (root == NULL)
        return createNode(key, name);
    if (key < root->key)
        root->left = insert(root->left, key, name);
    else if (key > root->key)
        root->right = insert(root->right, key, name);
    return root;
}

void kthSmallest(struct Node *root, int k, int *count, int *found)
{
    if (root == NULL || *found)
        return;
    kthSmallest(root->left, k, count, found);
    if (*found)
        return;
    (*count)++;
    if (*count == k)
    {
        printf("K-th Clearance Operative (K=%d): %s [Clearance: %d]\n",
               k, root->codename, root->key);
        *found = 1;
        return;
    }
    kthSmallest(root->right, k, count, found);
}

struct Node *findMin(struct Node *root)
{
    while (root != NULL && root->left != NULL)
        root = root->left;
    return root;
}

struct Node *purgeRange(struct Node *root, int L, int R)
{
    if (root == NULL)
        return NULL;
    root->left = purgeRange(root->left, L, R);
    root->right = purgeRange(root->right, L, R);

    if (root->key >= L && root->key <= R)
    {
        if (root->left == NULL)
        {
            struct Node *temp = root->right;
            free(root);
            return temp;
        }

        if (root->right == NULL)
        {
            struct Node *temp = root->left;
            free(root);
            return temp;
        }

        struct Node *temp = findMin(root->right);
        temp->left = root->left;
        struct Node *newRoot = root->right;
        free(root);
        return newRoot;
    }
    return root;
}

void inorder(struct Node *root)
{
    if (root == NULL)
        return;
    inorder(root->left);
    printf("%d : %s\n", root->key, root->codename);
    inorder(root->right);
}

void freeTree(struct Node *root)
{
    if (root == NULL)
        return;
    freeTree(root->left);
    freeTree(root->right);
    free(root);
}

int main()
{
    struct Node *root = NULL;
    int N, key, K, L, R;
    char name[31];

    scanf("%d", &N);

    for (int i = 0; i < N; i++)
    {
        scanf("%d %30s", &key, name);
        root = insert(root, key, name);
    }

    scanf("%d", &K);
    int count = 0, found = 0;
    kthSmallest(root, K, &count, &found);

    if (!found)
        printf("K-th element does not exist\n");

    scanf("%d %d", &L, &R);
    root = purgeRange(root, L, R);

    printf("Post-Purge Vault Records :\n");

    if (root == NULL)
        printf("VAULT_EMPTY\n");
    else
        inorder(root);

    freeTree(root);
    return 0;
}
